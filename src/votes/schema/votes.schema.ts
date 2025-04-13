import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { IVotes } from '../../../common/types';

export type VotesDocument = Votes & Document;

@Schema()
export class Votes implements IVotes {
  @Prop({ required: true, unique: true })
  candidate: string;

  @Prop({ required: true })
  votes: number;
}

export const VotesSchema = SchemaFactory.createForClass(Votes);
