const messagesService = require("./messages.service");

async function list(req, res, next) {
  try {
    res.json(await messagesService.listForChat(req.user.userId, req.params.chatId));
  } catch (err) {
    next(err);
  }
}

async function edit(req, res, next) {
  try {
    const { chatId, messageId } = req.params;
    res.json(await messagesService.editAndTruncate(req.user.userId, chatId, messageId, req.body.content));
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    const { chatId, messageId } = req.params;
    res.json(await messagesService.remove(req.user.userId, chatId, messageId));
  } catch (err) {
    next(err);
  }
}

module.exports = { list, edit, remove };
