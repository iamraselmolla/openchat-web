require("dotenv/config");

module.exports = {
  port: parseInt(process.env.PORT ?? "4000", 10),
  database: { url: process.env.DATABASE_URL },
  redis: { url: process.env.REDIS_URL ?? "redis://localhost:6379" },
  jwt: {
    secret: process.env.JWT_SECRET ?? "dev-secret-change-me",
    expiresIn: process.env.JWT_EXPIRES_IN ?? "7d",
  },
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
    defaultModel: process.env.OPENAI_DEFAULT_MODEL ?? "gpt-4o-mini",
  },
  corsOrigin: process.env.CORS_ORIGIN ?? "http://localhost:3000",
};
