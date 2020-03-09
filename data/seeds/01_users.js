const bcrypt = require('bcrypt');
const hash = bcrypt.hashSync('testing123', 8);

exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        {username: 'test1', password: hash},
        {username: 'test2', password: hash},
        {username: 'test3', password: hash}
      ]);
    });
};
