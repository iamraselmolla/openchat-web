const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");

const config = require("./config");
const { requestLogger } = require("./middleware/requestLogger");
const { errorHandler, notFoundHandler } = require("./middleware/errorHandler");

const authRoutes = require("./modules/auth/auth.routes");
const usersRoutes = require("./modules/users/users.routes");
const chatsRoutes = require("./modules/chats/chats.routes");
const messagesRoutes = require("./modules/messages/messages.routes");
const aiRoutes = require("./modules/ai/ai.routes");

const app = express();

app.use(
  cors({
    origin: config.corsOrigin,
    credentials: true,
  }),
);
app.use(express.json());
app.use(requestLogger);

// Global rate limit — replaces Nest's ThrottlerModule.forRoot([{ ttl: 60_000, limit: 60 }])
// applied everywhere via APP_GUARD.
app.use(
  rateLimit({
    windowMs: 60_000,
    limit: 60,
    standardHeaders: true,
    legacyHeaders: false,
  }),
);

const api = express.Router();
api.use("/auth", authRoutes);
api.use("/users", usersRoutes);
api.use("/chats", chatsRoutes);
// mounted as sub-paths of /chats/:chatId/... so mergeParams in each router
// picks up :chatId from here.
api.use("/chats/:chatId/messages", messagesRoutes);
api.use("/chats/:chatId/stream", aiRoutes);

// setGlobalPrefix('api/v1') equivalent
app.use("/api/v1", api);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
