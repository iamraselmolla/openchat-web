const { prisma } = require("../../lib/prisma");
const { NotFoundError } = require("../../lib/errors");

async function getProfile(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { settings: true },
  });
  if (!user) throw new NotFoundError("User not found");
  const { passwordHash: _passwordHash, ...safeUser } = user;
  return safeUser;
}

async function updateProfile(userId, data) {
  return prisma.user.update({ where: { id: userId }, data });
}

async function updateSettings(userId, data) {
  return prisma.userSettings.upsert({
    where: { userId },
    update: data,
    create: { userId, ...data },
  });
}

module.exports = { getProfile, updateProfile, updateSettings };
