import { IsBoolean, IsEnum } from 'class-validator';
import { Role } from '../../../common/types';
import { IsString, MinLength, IsNotEmpty } from 'class-validator';

export class UpdateUserRoleDto {
  @IsEnum(Role, {
    message: 'Role must be either ADMIN or USER',
  })
  role: Role;
}

export class UpdatePasswordDto {
  @IsString({ message: 'Password must be a string' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;
}

export class UpdateUsernameDto {
  @IsString({ message: 'Username must be a string' })
  @IsNotEmpty({ message: 'Username cannot be empty' })
  username: string;
}

export class UpdateVoteStateDto {
  @IsBoolean({ message: 'UpdateTo must be a boolean' })
  @IsNotEmpty({ message: 'UpdateTo is required' })
  updateTo: boolean;
}
