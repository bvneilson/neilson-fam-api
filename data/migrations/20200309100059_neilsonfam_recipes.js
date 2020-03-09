
exports.up = function(knex) {
  return knex.schema
  .createTable('users', tbl => {
    tbl.increments();
    tbl.text('username', 128)
      .notNullable()
      .unique();
    tbl.text('password', 128)
      .notNullable();
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
    tbl.text('added_by', 128)
      .notNullable();
    tbl.integer('prep_time', 128);
    tbl.integer('cook_time', 128);
  })
};

exports.down = function(knex) {
  return knex.schema
  .dropTableIfExists('recipes')
  .dropTableIfExists('users');
};
