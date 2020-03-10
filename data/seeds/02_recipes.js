
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('recipes').del()
    .then(function () {
      // Inserts seed entries
      return knex('recipes').insert([
        {name: 'Cereal and Milk', description: 'Milk and Cereal in a bowl', directions: ['Pour cereal into bowl', 'Pour milk into bowl', 'Eat with a spoon'], ingredients: ['Cereal', 'Milk'], user_id: 1, prep_time: 1, cook_time: 0},
        {name: 'PB&J Sandwich', description: 'Peanut butter and jelly on bread', directions: ['Spread peanut butter on one slice of bread', 'Spread jelly on the other slice of bread', 'Put peanut butter and jelly sides of bread together', 'Eat with hands'], ingredients: ['Peanut Butter', 'Jelly'], user_id: 1, prep_time: 5, cook_time: 0},
        {name: 'Easy Omelette', description: 'Egg omelette with your favorite fillings', directions: ['Heat pan on stove over medium heat', 'Mix some eggs in a bowl', 'Place any vegetables or pre-cooked meat in the bowl with the eggs and mix together', 'Spray pan with cooking spray', 'Pour contents of bowl into pan and let cook for 3-5 minutes', 'Flip omelette', 'Top with cheese, fold in half and remove from heat when cooked'], ingredients: ['Eggs', 'Meat', 'Vegetable', 'Cooking spray', 'Cheese'], user_id: 1, prep_time: 5, cook_time: 10}
      ]);
    });
};
