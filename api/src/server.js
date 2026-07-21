const app = require("./app");
const config = require("./config");
const { prisma } = require("./lib/prisma");
const redis = require("./lib/redis");

const server = app.listen(config.port, () => {
  console.log(`API ready → http://localhost:${config.port}/api/v1`);
});

// Mirrors Nest's onModuleDestroy hooks on PrismaService/RedisService.
async function shutdown() {
  console.log("Shutting down...");
  server.close();
  await prisma.$disconnect();
  await redis.client.quit();
  process.exit(0);
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
