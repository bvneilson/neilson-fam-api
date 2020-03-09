const express = require('express');
const db = require('./recipe-model.js');

const router = express.Router();

router.get('/', (req, res) => {
  db.getRecipes().then(recipes => {
    res.status(200).json({message: 'Here are the recipes', recipes})
  }).catch(err => {
    res.status(500).json({message: 'Could not get recipes', error: err})
  })
})

module.exports = router;
