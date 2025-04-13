import { JwtPayload } from './common/types';

declare global {
  namespace Express {
    export interface Request {
      user: JwtPayload;
    }
  }
}
