const usersService = require("./users.service");

async function getProfile(req, res, next) {
  try {
    res.json(await usersService.getProfile(req.user.userId));
  } catch (err) {
    next(err);
  }
}

async function updateProfile(req, res, next) {
  try {
    res.json(await usersService.updateProfile(req.user.userId, req.body));
  } catch (err) {
    next(err);
  }
}

async function updateSettings(req, res, next) {
  try {
    res.json(await usersService.updateSettings(req.user.userId, req.body));
  } catch (err) {
    next(err);
  }
}

module.exports = { getProfile, updateProfile, updateSettings };
