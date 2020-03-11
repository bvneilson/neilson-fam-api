const bcrypt = require('bcrypt');
const hash = bcrypt.hashSync('testing123', 8);

exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        {username: 'test1', password: hash, first_name: 'Test', last_name: 'Test', profile_photo_url: 'https://neilsoncookbook.s3-us-west-1.amazonaws.com/profile-pictures/Photo+on+12-11-19+at+7.12+PM.jpg'},
        {username: 'test2', password: hash, first_name: 'Test', last_name: 'Test', profile_photo_url: 'https://neilsoncookbook.s3-us-west-1.amazonaws.com/profile-pictures/Photo+on+12-11-19+at+7.12+PM.jpg'},
        {username: 'test3', password: hash, first_name: 'Test', last_name: 'Test', profile_photo_url: 'https://neilsoncookbook.s3-us-west-1.amazonaws.com/profile-pictures/Photo+on+12-11-19+at+7.12+PM.jpg'}
      ]);
    });
};
