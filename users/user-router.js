const express = require('express');
const db = require('./user-model.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// Load the AWS SDK for Node.js
const aws = require('aws-sdk');

const secret = process.env.JWT_SECRET;
const router = express.Router();

//configuring the AWS environment
aws.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});
const s3 = new aws.S3();

// User Endpoints

router.post('/register', userValidation, (req, res) => {
  const newUser = req.body;
  const hash = bcrypt.hashSync(newUser.password, 8);
  newUser.password = hash;
  if (!newUser.first_name) {
    newUser.first_name = '';
  }
  if (!newUser.last_name) {
    newUser.last_name = '';
  }
  if (!newUser.profile_photo_url) {
    newUser.profile_photo_url = 'https://neilsoncookbook.s3-us-west-1.amazonaws.com/profile-pictures/default.png';
  }

  function uploadprofpic(params, newUser) {
    s3.upload(params, async (err, data) => {
      if (err) {
        res.send("Error", err);
      }
      if (data) {
        newUser.profile_photo_url = data.Location;
        registerTheUser(newUser);
      }
    });
  }

  function registerTheUser(newUser) {
    db.register(newUser).then(response => {
      db.getUserByUsername(newUser.username).first().then(user => {
        const token = generateToken(user);
        res.status(201).json({
          message: `User successfully created. Welcome, ${user.username}! Here is your token...`,
          token,
          user
        });
      }).catch(err => {
        res.status(400).json({message: "Error during user creation", error: err});
      })
    }).catch(err => {
      res.status(500).json({message: "Could not register user", error: err});
    })
  }

  if (req.files) {
    var params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Body : req.files.profpic.data,
      Key : `profile-pictures/${req.files.profpic.name}`
    };
    uploadprofpic(params, newUser);
  } else {
    registerTheUser(newUser);
  }
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
    res.status(500).json({message: "Could not log in", error: err});
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
    res.status(500).json({message: "Could not get users", error: err});
  })
});

router.get('/:id', (req, res) => {
  const { id } = req.params
  db.getUserById(id).then(user => {
    res.status(200).json({message: "Here is the user", user});
  }).catch(err => {
    res.status(500).json({message: "Could not get user", error: err});
  })
});

router.get('/:id/recipes', (req, res) => {
  const { id } = req.params
  db.getUserRecipes(id).then(recipes => {
    res.status(200).json({message: "Here are the user's recipes", recipes});
  }).catch(err => {
    res.status(500).json({message: "Could not get user's recipes", error: err});
  })
});

router.put('/:id', (req, res) => {
  const { id } = req.params;
  db.updateUser(id, req.body).then(response => {
    db.getUserById(id).then(user => {
      res.status(200).json({message: "User successfully updated", user});
    }).catch(err => {
      res.status(404).json({message: "A user with that id does not exist", error: err})
    })
  }).catch(err => {
    res.status(500).json({message: "Could not update user", error: err});
  })
});

router.delete('/:id', restricted, (req, res) => {
  const { id } = req.params
  db.deleteUser(id).then(response => {
    res.status(200).json({message: "User successfully deleted", response});
  }).catch(err => {
    res.status(500).json({message: "Could not delete user", error: err});
  })
});

router.post('/uploadprofpic', (req, res) => {
  console.log(req.files.profpic);
  //configuring parameters
  var params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Body : req.files.profpic.data,
    Key : `profile-pictures/${req.files.profpic.name}`
  };

  s3.upload(params, (err, data) => {
    //handle error
    if (err) {
      console.log("Error", err);
    }

    //success
    if (data) {
      console.log("Uploaded in:", data);
      res.status(200).json({message: 'Success!!!', location: data.Location})
    }
  });
})

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
  if(req.body.data) {
    req.body = JSON.parse(req.body.data);
  }
  //console.log(JSON.parse(req.body.data));
  if (!req.body.username) {
    res.send("Username is required");
  } else if (!req.body.password) {
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
