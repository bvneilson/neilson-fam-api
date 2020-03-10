const express = require('express');
const db = require('./user-model.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET;

const router = express.Router();

// User Endpoints

router.post('/register', userValidation, (req, res) => {
  const newUser = req.body;
  const hash = bcrypt.hashSync(newUser.password, 8);
  newUser.password = hash;

  db.register(newUser).then(response => {
    db.getUserByUsername(newUser.username).first().then(user => {
      const token = generateToken(user);
      res.status(201).json({
        message: `User successfully created. Welcome, ${user.username}! Here is your token...`,
        token
      });
    }).catch(err => {
      res.status(400).json({message: "Error during user creation"});
    })
  }).catch(err => {
    res.status(500).json({message: "Could not register user"});
  })
})

router.post('/login', userValidation, (req, res) => {
  db.login(req.body).first().then(user => {
    if (!user || !bcrypt.compareSync(req.body.password, user.password)) {
      res.status(401).json({error: 'Invalid credentials'});
    } else {
      const token = generateToken(user);
      res.status(200).json({
        message: `Welcome, ${user.username}! Have a token...`,
        token
      });
    }
  }).catch(err => {
    res.status(500).json({message: "Could not log in"});
  })
})

router.get('/', (req, res) => {
  db.getUsers().then(users => {
    const userIdArray = users.map(user => {
      user.recipes = [];
      return user.id;
    });
    db.getRecipes(userIdArray).then(recipes => {
      users.forEach(user => {
        recipes.forEach(recipe => {
          if (recipe.user_id === user.id) {
            user.recipes.push(recipe);
          }
        })
      })
      res.status(200).json({message: "Here are the users", users});
    });
  }).catch(err => {
    res.status(500).json({message: "Could not get users"});
  })
});

router.get('/:id', (req, res) => {
  const { id } = req.params
  db.getUserById(id).then(user => {
    res.status(200).json({message: "Here is the user", user});
  }).catch(err => {
    res.status(500).json({message: "Could not get user"});
  })
});

router.get('/:id/recipes', (req, res) => {
  const { id } = req.params
  db.getUserRecipes(id).then(recipes => {
    res.status(200).json({message: "Here are the user's recipes", recipes});
  }).catch(err => {
    res.status(500).json({message: "Could not get user's recipes"});
  })
});

router.put('/:id', (req, res) => {
  const { id } = req.params;
  db.updateUser(id, req.body).then(response => {
    db.getUserById(id).then(user => {
      res.status(200).json({message: "User successfully updated", user});
    }).catch(err => {
      res.status(404).json({message: "A user with that id does not exist"})
    })
  }).catch(err => {
    res.status(500).json({message: "Could not update user"});
  })
});

router.delete('/:id', restricted, (req, res) => {
  const { id } = req.params
  db.deleteUser(id).then(response => {
    res.status(200).json({message: "User successfully deleted", response});
  }).catch(err => {
    res.status(500).json({message: "Could not delete user"});
  })
});

function generateToken(user) {
  const payload = {
    subject: user.id,
    username: user.username,
  };

  const options = {
    expiresIn: '7d',
  };

  return jwt.sign(payload, secret, options);
}

// Custom Middleware

function userValidation(req, res, next) {
  if (!req.username) {
    res.send("Username is required");
  } else if (!req.password) {
    res.send("Password is required");
  } else {
    next();
  }
}

function restricted(req, res, next) {
  const token = req.headers.authorization;

  if (token) {
    jwt.verify(token, secret, (err, decodedToken) => {
      if(err) {
        res.status(401).json({message: "Invalid token"})
      } else {
        next();
      }
    })
  } else {
    res.status(401).json({message: "You shall not pass"})
  }
}

module.exports = router;
