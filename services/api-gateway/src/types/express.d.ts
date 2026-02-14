import 'express';
import type { JwtPayload } from 'jsonwebtoken';

declare module 'express' {
  interface Request {
    user?: JwtPayload | string;
  }
}

