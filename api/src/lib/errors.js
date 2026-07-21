class AppError extends Error {
  constructor(statusCode, message) {
    super(typeof message === "string" ? message : JSON.stringify(message));
    this.statusCode = statusCode;
    this.body = message; // lets us send objects/arrays as-is, like Nest does
  }
}

class BadRequestError extends AppError {
  constructor(message = "Bad request") {
    super(400, message);
  }
}

class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized") {
    super(401, message);
  }
}

class ForbiddenError extends AppError {
  constructor(message = "Forbidden") {
    super(403, message);
  }
}

class NotFoundError extends AppError {
  constructor(message = "Not found") {
    super(404, message);
  }
}

class ConflictError extends AppError {
  constructor(message = "Conflict") {
    super(409, message);
  }
}

module.exports = {
  AppError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
};
