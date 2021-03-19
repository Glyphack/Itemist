import { AuthenticatedRequest } from '../../types/request';
import { NextFunction } from 'express';

function isOwner(req: AuthenticatedRequest, res: any, next: NextFunction): void {
  if (req.user.steamId === req.params.steamId) {
    next();
  } else {
    res.status(403);
    void res.json("You don't have permission to access this information");
  }
}

export = isOwner;
