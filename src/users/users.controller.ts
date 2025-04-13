import { Body, Controller, Get, Patch, Param, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './schemas/users.schema';
import { validateRoles } from '../../utils/validateRoles';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../common/roles.guard';
import { Roles } from '../../common/roles.decorator';
import { Role } from '../../common/types';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @Get()
  async findAll() {
    return this.usersService.findAll();
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
    @Body('role') role: string,
  ): Promise<User> {
    const userRole = validateRoles(role);
    return this.usersService.updateRole(username, userRole);
  }
}
