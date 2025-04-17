import { Test, TestingModule } from '@nestjs/testing';
import { VotesService } from './votes/votes.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Votes } from './votes/schema/votes.schema';

describe('VotesService', () => {
  let service: VotesService;
  let model: jest.Mocked<Model<Votes>>;

  const mockVoteDoc = {
    candidate: 'Barack Obama',
    votes: 1,
    save: jest.fn().mockResolvedValue({ candidate: 'Barack Obama', votes: 2 }),
  };

  const execMock = jest.fn();
  const mockVotesModel = {
    findOne: jest.fn().mockImplementation(() => ({ exec: execMock })),
    find: jest.fn().mockImplementation(() => ({ exec: execMock })),
    create: jest.fn(),
    aggregate: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VotesService,
        {
          provide: getModelToken(Votes.name),
          useValue: mockVotesModel,
        },
      ],
    }).compile();

    service = module.get<VotesService>(VotesService);
    model = module.get(getModelToken(Votes.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return total votes', async () => {
    model.aggregate.mockResolvedValue([{ totalVotes: 42 }]);
    const result = await service.getTotalVotes();
    expect(result).toBe(42);
  });

  it('should add a vote to an existing candidate', async () => {
    execMock.mockResolvedValueOnce(mockVoteDoc);
    const result = await service.addVote('Barack Obama');
    expect(result).toEqual({ candidate: 'Barack Obama', votes: 2 });
    expect(mockVoteDoc.save).toHaveBeenCalled();
  });
});
