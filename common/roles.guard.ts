import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';
import { Role } from './types';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Retrieve roles metadata defined on the route handler (or controller)
    const requiredRoles = this.reflector.get<Role[]>(
      ROLES_KEY,
      context.getHandler(),
    );

    // If there are no roles defined, allow access (or you could also choose to deny access)
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    // Access the request and get the authenticated user (populated by your JWT strategy)
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // If the user is not attached, you can either return false or throw an exception
    if (!user) {
      throw new ForbiddenException('User not found');
    }

    // Check if the user's role (or roles) match any of the requiredRoles.
    // Assuming that user.role is a single role (string):
    const hasRole = requiredRoles.includes(user.role);

    // Alternatively, if the user object has an array of roles (e.g., user.roles),
    // you might do something like:
    // const hasRole = requiredRoles.some(role => user.roles?.includes(role));

    if (!hasRole) {
      throw new ForbiddenException('You do not have the required permissions');
    }

    return true;
  }
}
