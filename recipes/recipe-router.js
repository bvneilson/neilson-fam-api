const express = require('express');

const router = express.Router();
const db = require('./recipe-model.js');

router.post('/', recipeValidation, (req, res) => {
  db.createRecipe(req.body).then(response => {
    res.status(201).json({message: "Recipe successfully created"});
  }).catch(err => {
    res.status(500).json({message: "Could not create recipe", error: err});
  })
});

router.get('/', (req, res) => {
  db.getRecipes().then(recipes => {
    res.status(200).json({message: "Here are the recipes", recipes});
  }).catch(err => {
    res.status(500).json({error: "Could not get recipes", error: err});
  })
});

router.get('/:id', (req, res) => {
  const { id } = req.params;
  db.findRecipeById(id).then(recipe => {
    res.status(200).json({message: "Here is the recipe", recipe});
  }).catch(err => {
    res.status(500).json({error: "Could not get recipe", error: err});
  })
});

router.put('/:id', (req, res) => {
  const { id } = req.params;
  db.updateRecipe(id, req.body).then(response => {
    db.findRecipeById(id).then(recipe => {
      res.status(200).json({message: "Recipe successfully updated", recipe});
    }).catch(err => {
      res.status(404).json({message: "An recipe with that id does not exist", error: err})
    })
  }).catch(err => {
    res.status(500).json({message: "Could not update recipe", error: err});
  })
});

router.delete('/:id', (req, res) => {
  const { id } = req.params
  db.deleteRecipe(id).then(response => {
    res.status(200).json({message: "Recipe successfully deleted", response});
  }).catch(err => {
    res.status(500).json({message: "Could not delete recipe", error: err});
  })
});

// Custom Middleware
function recipeValidation(req, res, next) {
  !req.body.name ? res.send("Recipe name is required") :
    !req.body.directions ? res.send("Recipe directions required") :
      !req.body.ingredients ? res.send("Recipe ingredients required") :
        !req.body.user_id ? res.send("user_id is not valid") :
          next();
}

module.exports = router;
