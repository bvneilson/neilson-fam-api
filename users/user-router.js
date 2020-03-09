const express = require('express');
const db = require('./user-model.js');
const bcrypt = require('bcrypt');

const router = express.Router();

router.post('/register', (req, res) => {
  req.body.password = bcrypt.hashSync(req.body.password, 8);
  db.register(req.body).then(response => {
    db.getUserByUsername(req.body.username).first().then(user => {
      res.status(200).json({message: 'User successfully created', user});
    }).catch(err => {
      res.status(401).json({message: 'A user with that username does not exist', error: err});
    })
  }).catch(err => {
    res.status(500).json({message: 'Could not create user', error: err});
  })
})

module.exports = router;
