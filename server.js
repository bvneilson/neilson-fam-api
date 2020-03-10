const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const userRoutes = require('./users/user-router.js');
const recipeRoutes = require('./recipes/recipe-router.js');
const expressfileupload = require('express-fileupload');

const server = express();

server.use(express.json());
server.use(helmet());
server.use(cors());
server.use('/api/users', userRoutes);
server.use('/api/recipes', recipeRoutes);
server.use(expressfileupload());

server.get('/', (req, res) => {
  res.send('Welcome to the Neilson fam api');
})

module.exports = server;
