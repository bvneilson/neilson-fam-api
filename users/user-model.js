const db = require('../data/dbConfig.js');

function register(user) {
  return db('users').insert(user);
}

function login(user) {
  return db('users').where({username: user.username});
}

function getUserById(id) {
  return db('users').where({id: id}).select('id', 'username');
}

function getUserByUsername(username) {
  return db('users').where({username: username}).select('id', 'username');
}

function getUsers() {
  return db('users').select('id', 'username');
}

function deleteUser(id) {
  return db('users').where({id: id}).del();
}

function updateUser(id, user) {
  return db('users').where({ id: id }).update(user);
}

function getUserRecipes(id) {
  return db('recipes').where({user_id: id});
}

function getRecipes(userIds) {
  return db('recipes').whereIn('user_id', userIds);
}

module.exports = {
  register,
  login,
  getUserById,
  getUserByUsername,
  getUsers,
  updateUser,
  deleteUser,
  getUserRecipes,
  getRecipes
}
