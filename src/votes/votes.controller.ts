import { Controller, Get, Post, Param, UseGuards } from '@nestjs/common';
import { VotesService } from './votes.service';
import { Votes } from './schema/votes.schema';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../common/roles.guard';
import { Role } from '../../common/types';
import { Roles } from '../../common/roles.decorator';

@Controller('votes')
export class VotesController {
  constructor(private readonly votesService: VotesService) {}

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @Get()
  async getAllVotes(): Promise<Votes[]> {
    return this.votesService.findAll();
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @Get(':candidate')
  async getVotesForCandidate(
    @Param('candidate') candidate: string,
  ): Promise<Votes> {
    return this.votesService.findByCandidate(candidate);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @Get('total')
  async getTotalVotes(): Promise<{ totalVotes: number }> {
    const totalVotes = await this.votesService.getTotalVotes();
    return { totalVotes };
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.USER)
  @Post('vote/:candidate')
  async voteForCandidate(
    @Param('candidate') candidate: string,
  ): Promise<Votes> {
    return this.votesService.addVote(candidate);
  }
}
