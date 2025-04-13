import { Injectable, InternalServerErrorException } from '@nestjs/common';
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
      throw new InternalServerErrorException('User not found');
    }
    return user;
  }

  async updateRole(username: string, role: Role): Promise<User> {
    const user = await this.userModel.findOne({ username });
    if (!user) {
      throw new InternalServerErrorException('User not found');
    }

    user.role = role;
    return user.save();
  }
}
