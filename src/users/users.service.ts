import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/users.schema';
import { Role } from '../../common/types';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findByUsername(username: string): Promise<User> {
    const user = await this.userModel.findOne({ username }).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async updateRole(username: string, role: Role): Promise<User> {
    const user = await this.userModel.findOne({ username });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.role = role;
    return user.save();
  }

  async updatePassword(username: string, password: string): Promise<User> {
    const user = await this.userModel.findOne({ username });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.password = password;
    return user.save();
  }

  async updateUsername(
    oldUsername: string,
    newUsername: string,
  ): Promise<User> {
    const user = await this.userModel.findOne({ oldUsername });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.username = newUsername;
    return user.save();
  }

  async removeUser(username: string): Promise<User> {
    const user = await this.userModel.findOneAndDelete({ username }).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async updateVoteState(
    username: string,
    updateTo: boolean,
    role: Role,
  ): Promise<User> {
    const user = await this.userModel.findOne({ username }).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (role !== Role.ADMIN && updateTo && user.hasVoted) {
      throw new BadRequestException(
        'User has already voted and cannot vote again',
      );
    }

    if (role === Role.ADMIN) {
      user.hasVoted = updateTo;
    } else if (role === Role.USER) {
      if (updateTo && !user.hasVoted) {
        user.hasVoted = true;
      } else {
        throw new BadRequestException('Users can only vote once');
      }
    }

    return user.save();
  }
}
