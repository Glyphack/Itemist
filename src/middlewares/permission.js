function isOwner(req, res, next) {
  if (req.user.steamId === req.params.steamId) {
    next();
  } else {
    res.status(403);
    res.send("You don't have permission to access this information");
  }
}

module.exports = isOwner;
