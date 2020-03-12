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
server.use(expressfileupload());
server.use(referer);
server.use('/api/users', userRoutes);
server.use('/api/recipes', recipeRoutes);

server.get('/', (req, res) => {
  res.send('Welcome to the Neilson fam api');
})

function referer(req, res, next) {
  if(req.headers.host.includes("neilsoncookbook.com") || req.headers.host.includes("localhost:8087")) {
    next();
  } else {
    res.status(403).send("You shall not pass");
  }
}

module.exports = server;
