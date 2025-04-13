export enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export interface IUser {
  username: string;
  password: string;
  role: Role;
}

export interface IVotes {
  candidate: string;
  votes: number;
}

export interface JwtPayload {
  username: string;
  role: string;
}
