import { AuthenticatedRequest } from '../../types/request';

function isOwner(req: AuthenticatedRequest, res, next) {
  if (req.user.steamId === req.params.steamId) {
    next();
  } else {
    res.status(403);
    res.send("You don't have permission to access this information");
  }
}

export = isOwner;
