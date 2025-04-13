import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Votes, VotesDocument } from './schema/votes.schema';

@Injectable()
export class VotesService {
  constructor(
    @InjectModel(Votes.name) private votesModel: Model<VotesDocument>,
  ) {
    void this.addDefaultCandidates();
  }

  private async addDefaultCandidates() {
    const defaultCandidates = [
      'Donald Trump',
      'Hillary Clinton',
      'Barak Obama',
    ];

    for (const candidate of defaultCandidates) {
      const existingCandidate = await this.votesModel
        .findOne({ candidate })
        .exec();
      if (!existingCandidate) {
        await this.votesModel.create({ candidate, votes: 0 });
      }
    }
  }

  async findAll(): Promise<Votes[]> {
    return this.votesModel.find().exec();
  }

  async findByCandidate(candidate: string): Promise<Votes> {
    const vote = await this.votesModel.findOne({ candidate }).exec();
    if (!vote) {
      throw new NotFoundException(`Candidate ${candidate} not found`);
    }
    return vote;
  }

  async addVote(candidate: string): Promise<Votes> {
    let vote = await this.votesModel.findOne({ candidate }).exec();
    if (!vote) {
      vote = new this.votesModel({ candidate, votes: 0 });
    }
    vote.votes += 1;
    return vote.save();
  }

  async getTotalVotes(): Promise<number> {
    const votes = await this.votesModel.aggregate<{ totalVotes: number }>([
      { $group: { _id: null, totalVotes: { $sum: '$votes' } } },
    ]);

    return votes.length > 0 ? votes[0].totalVotes : 0;
  }
}
