const { PrismaClient } = require("@prisma/client");

// One PrismaClient for the whole process — Nest's PrismaModule was @Global()
// for exactly this reason, so we just export a singleton here instead.
const prisma = new PrismaClient();

module.exports = { prisma };
