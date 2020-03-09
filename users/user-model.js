const db = require('../data/dbConfig.js');

function register(user) {
  return db('users').insert(user);
}

function getUserByUsername(username) {
  return db('users').where("username", '=', username);
}

module.exports = {
  register,
  getUserByUsername
};
