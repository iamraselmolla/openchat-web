const chatsService = require("./chats.service");

async function list(req, res, next) {
  try {
    res.json(await chatsService.list(req.user.userId, req.query.search));
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    res.json(await chatsService.create(req.user.userId, req.body));
  } catch (err) {
    next(err);
  }
}

async function findOne(req, res, next) {
  try {
    res.json(await chatsService.findOneOrThrow(req.user.userId, req.params.id));
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    res.json(await chatsService.update(req.user.userId, req.params.id, req.body));
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    res.json(await chatsService.remove(req.user.userId, req.params.id));
  } catch (err) {
    next(err);
  }
}

module.exports = { list, create, findOne, update, remove };
