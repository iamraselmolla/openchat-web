const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { prisma } = require("../../lib/prisma");
const config = require("../../config");
const { ConflictError, UnauthorizedError } = require("../../lib/errors");

function buildAuthResponse(userId, email, name) {
  const accessToken = jwt.sign({ sub: userId, email }, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  });
  return { accessToken, user: { id: userId, email, name } };
}

async function register(dto) {
  const existing = await prisma.user.findUnique({ where: { email: dto.email } });
  if (existing) {
    throw new ConflictError("An account with this email already exists");
  }

  const passwordHash = await bcrypt.hash(dto.password, 10);
  const user = await prisma.user.create({
    data: {
      email: dto.email,
      name: dto.name,
      passwordHash,
      settings: { create: {} },
    },
  });

  return buildAuthResponse(user.id, user.email, user.name);
}

async function login(dto) {
  const user = await prisma.user.findUnique({ where: { email: dto.email } });
  if (!user) {
    throw new UnauthorizedError("Invalid email or password");
  }

  const passwordValid = await bcrypt.compare(dto.password, user.passwordHash);
  if (!passwordValid) {
    throw new UnauthorizedError("Invalid email or password");
  }

  return buildAuthResponse(user.id, user.email, user.name);
}

module.exports = { register, login };
