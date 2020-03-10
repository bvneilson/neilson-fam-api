const db = require('../data/dbConfig.js');

function createRecipe(recipe) {
  return db('recipes').insert(recipe);
}

function findRecipeById(id) {
  return db('recipes').where({id: id});
}

function findRecipesByName(name) {
  return db('recipes').where({name: name});
}

function getRecipes() {
  return db('recipes');
}

function updateRecipe(id, recipe) {
  return db('recipes').where({ id: id }).update(recipe);
}

function deleteRecipe(id) {
  return db('recipes').where({id: id}).del();
}

module.exports = {
  createRecipe,
  findRecipeById,
  findRecipesByName,
  getRecipes,
  updateRecipe,
  deleteRecipe
}
