import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '../../common/types';
import { UsersService } from '../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UsersService) {
    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret || typeof jwtSecret !== 'string') {
      throw new InternalServerErrorException(
        'JWT_SECRET is not defined in environment variables or is not a valid string',
      );
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.usersService.findByUsername(payload.username);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user;
  }
}
