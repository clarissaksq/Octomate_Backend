import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Votes, VotesSchema } from './schema/votes.schema';
import { VotesService } from './votes.service';
import { VotesController } from './votes.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Votes.name, schema: VotesSchema }]),
  ],
  controllers: [VotesController],
  providers: [VotesService],
})
export class VotesModule {}
