const jwt = require("jsonwebtoken");
const config = require("../config");
const { UnauthorizedError } = require("../lib/errors");

// Reads "Authorization: Bearer <token>", verifies it, and sets req.user
// to { userId, email } — the same shape @CurrentUser() returned in Nest.
function requireAuth(req, res, next) {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return next(new UnauthorizedError("Missing bearer token"));
  }

  try {
    const payload = jwt.verify(token, config.jwt.secret);
    req.user = { userId: payload.sub, email: payload.email };
    next();
  } catch {
    next(new UnauthorizedError("Invalid or expired token"));
  }
}

module.exports = { requireAuth };
