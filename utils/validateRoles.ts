import { Role } from '../common/types';
import { BadRequestException } from '@nestjs/common';

export function validateRoles(role: string): Role {
  const userRole = Role[role.toUpperCase() as keyof typeof Role];

  if (!userRole) {
    if (!userRole) {
      throw new BadRequestException('Invalid role provided');
    }
  }

  return userRole;
}
