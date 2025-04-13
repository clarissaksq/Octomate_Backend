import { Test, TestingModule } from '@nestjs/testing';
import { VotesService } from './votes/votes.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Votes } from './votes/schema/votes.schema';

describe('VotesService', () => {
  let service: VotesService;
  let model: Model<Votes>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VotesService,
        {
          provide: getModelToken(Votes.name),
          useValue: {
            findOne: jest.fn(),
            find: jest.fn(),
            save: jest.fn(),
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<VotesService>(VotesService);
    model = module.get<Model<Votes>>(getModelToken(Votes.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
