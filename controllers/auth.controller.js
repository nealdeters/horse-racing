const { User } = require('../database/models');
const bcrypt = require('bcrypt');

const login = (req, res) => {
  return res.status(200).send("User logged in.");
}

const logout = (req, res) => {
  req.logout();
  return res.status(200).send("User logged out.");
}

module.exports = {
  login,
  logout
}