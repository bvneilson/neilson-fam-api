
exports.up = function(knex) {
  return knex.schema
  .createTable('users', tbl => {
    tbl.increments();
    tbl.text('username', 128)
      .notNullable()
      .unique();
    tbl.text('password', 128)
      .notNullable();
    tbl.text('first_name', 128);
    tbl.text('last_name', 128);
    tbl.text('profile_photo_url', 128);
  })
  .createTable('recipes', tbl => {
    tbl.increments();
    tbl.text('name', 128)
      .notNullable();
    tbl.text('description', 128);
    tbl.specificType('directions', 'text ARRAY')
      .notNullable();
    tbl.specificType('ingredients', 'text ARRAY')
      .notNullable();
      tbl.integer('user_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
        .onUpdate('CASCADE');
    tbl.integer('prep_time', 128);
    tbl.integer('cook_time', 128);
    tbl.specificType('photo_urls', 'text ARRAY');
  })
};

exports.down = function(knex) {
  return knex.schema
  .dropTableIfExists('recipes')
  .dropTableIfExists('users');
};
