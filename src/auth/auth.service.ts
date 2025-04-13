import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User, UserDocument } from '../users/schemas/users.schema';
import { JwtService } from '@nestjs/jwt';
import { validateRoles } from '../../utils/validateRoles';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async register(
    username: string,
    password: string,
    role: string,
  ): Promise<string> {
    try {
      const existingUser = await this.userModel.findOne({ username });
      if (existingUser) {
        throw new ConflictException('Username already taken');
      }

      const userRole = validateRoles(role);

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = new this.userModel({
        username,
        password: hashedPassword,
        role: userRole,
      });

      await user.save();
      return this.generateJwt(user);
    } catch {
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  async login(username: string, password: string): Promise<string> {
    const user = await this.userModel.findOne({ username });
    if (!user) {
      throw new ConflictException('User not found');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new ConflictException('Invalid password');
    }

    return this.generateJwt(user);
  }

  private generateJwt(user: User): string {
    const payload = { username: user.username, role: user.role };
    return this.jwtService.sign(payload);
  }
}
