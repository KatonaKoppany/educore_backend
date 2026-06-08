import { Role } from '@/enums/role';
import { Request } from 'express';

declare module 'express' {
  interface Request {
    user: {
      userId: string;
      role: Role;
    };
  }
}
