import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  user: { steamId: string };
}
