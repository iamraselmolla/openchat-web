const Redis = require("ioredis");
const config = require("../config");

const client = new Redis(config.redis.url, {
  maxRetriesPerRequest: 3,
});

client.on("error", (err) => {
  console.error("[redis] connection error:", err.message);
});

async function get(key) {
  const raw = await client.get(key);
  return raw ? JSON.parse(raw) : null;
}

async function set(key, value, ttlSeconds = 60) {
  await client.set(key, JSON.stringify(value), "EX", ttlSeconds);
}

async function invalidate(key) {
  await client.del(key);
}

async function checkRateLimit(key, limit, windowSeconds) {
  const count = await client.incr(key);
  if (count === 1) {
    await client.expire(key, windowSeconds);
  }
  return count <= limit;
}

module.exports = { client, get, set, invalidate, checkRateLimit };
