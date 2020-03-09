const db = require('../data/dbConfig.js');

function getRecipes() {
  return db('recipes');
}

module.exports = {
  getRecipes
}
