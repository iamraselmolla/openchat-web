const { BadRequestError } = require("../lib/errors");

// Wraps a Zod schema as middleware. Mirrors Nest's global ValidationPipe
// (whitelist + transform + forbidNonWhitelisted): unknown keys are rejected,
// and the parsed/coerced value replaces req.body.
function validateBody(schema) {
  return (req, res, next) => {
    const result = schema.strict().safeParse(req.body);
    if (!result.success) {
      const messages = result.error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`);
      return next(new BadRequestError(messages));
    }
    req.body = result.data;
    next();
  };
}

module.exports = { validateBody };
