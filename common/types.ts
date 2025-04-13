export enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export interface IUser {
  username: string;
  password: string;
  role: Role;
}

export interface JwtPayload {
  username: string;
  role: string;
}
