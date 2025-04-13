import {
  Body,
  Controller,
  Get,
  Patch,
  Param,
  UseGuards,
  Delete,
  Request,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './schemas/users.schema';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../common/roles.guard';
import { Roles } from '../../common/roles.decorator';
import { Role, JwtPayload } from '../../common/types';
import {
  UpdateUserRoleDto,
  UpdatePasswordDto,
  UpdateUsernameDto,
  UpdateVoteStateDto,
} from './dto/users.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @Get()
  async findAll() {
    return this.usersService.findAll();
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.USER, Role.ADMIN)
  @Get('getMe')
  async getMe(@Request() req) {
    const username = req.user.username;
    return this.usersService.findByUsername(username);
  }

  @UseGuards(AuthGuard('jwt'))
  @Roles(Role.ADMIN)
  @Get('/:username')
  async findOne(@Param('username') username: string): Promise<User> {
    return this.usersService.findByUsername(username);
  }

  @UseGuards(AuthGuard('jwt'))
  @Roles(Role.ADMIN)
  @Patch('update-role/:username')
  async updateRole(
    @Param('username') username: string,
    @Body() updateUserRoleDto: UpdateUserRoleDto,
  ): Promise<User> {
    return this.usersService.updateRole(username, updateUserRoleDto.role);
  }

  @UseGuards(AuthGuard('jwt'))
  @Roles(Role.ADMIN)
  @Patch('update-password/:username')
  async updatePassword(
    @Param('username') username: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ): Promise<User> {
    return this.usersService.updatePassword(
      username,
      updatePasswordDto.password,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Roles(Role.ADMIN)
  @Patch('update-username/:username')
  async updateUsername(
    @Param('username') oldUsername: string,
    @Body() updateUsernameDto: UpdateUsernameDto,
  ): Promise<User> {
    return this.usersService.updateUsername(
      oldUsername,
      updateUsernameDto.username,
    );
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @Delete('remove/:username')
  async removeUser(@Param('username') username: string): Promise<User> {
    return this.usersService.removeUser(username);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN, Role.USER)
  @Patch('update-vote-state')
  async updateVoteState(
    @Body() updateVoteStateDto: UpdateVoteStateDto,
    @Request() req,
  ): Promise<User> {
    const role = req.user.role;
    const username = req.user.username;
    return this.usersService.updateVoteState(
      username,
      updateVoteStateDto.updateTo,
      role,
    );
  }
}
