const { AppError } = require("../lib/errors");

// Express recognizes this as an error handler because it takes 4 args.
// Must be registered LAST, after all routes.
function errorHandler(err, req, res, next) {
  const status = err instanceof AppError ? err.statusCode : 500;
  const message = err instanceof AppError ? err.body : "Something went wrong. Please try again.";

  if (status >= 500) {
    console.error(err.stack ?? err);
  }

  res.status(status).json({
    statusCode: status,
    message,
    timestamp: new Date().toISOString(),
  });
}

// Catches routes that don't match anything (replaces Nest's default 404).
function notFoundHandler(req, res) {
  res.status(404).json({
    statusCode: 404,
    message: `Cannot ${req.method} ${req.originalUrl}`,
    timestamp: new Date().toISOString(),
  });
}

module.exports = { errorHandler, notFoundHandler };
