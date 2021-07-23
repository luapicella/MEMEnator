'use strict';

const express = require('express');
const morgan = require('morgan');
const passport = require('passport'); // auth middleware
const LocalStrategy = require('passport-local').Strategy; // username and password for login
const session = require('express-session'); // enable sessions
const { validationResult } = require('express-validator');
const { postMemesValidator, deleteMemesValidator } = require('./validators.js')
const memeDao = require('./memeDao'); // module for accessing the DB
const userDao = require('./userDao'); // module for accessing the DB

/*** Set up Passport ***/
// set up the "username and password" login strategy
// by setting a function to verify username and password
passport.use(new LocalStrategy(
  function (username, password, done) {
    userDao.getUser(username, password).then((user) => {
      if (!user)
        return done(null, false, { message: 'Incorrect username and/or password.' });

      return done(null, user);
    })
  }
));

// serialize and de-serialize the user (user object <-> session)
// we serialize the user id and we store it in the session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// starting from the data in the session, we extract the current (logged-in) user
passport.deserializeUser((id, done) => {
  userDao.getUserById(id)
    .then(user => {
      done(null, user); //req.user
    }).catch(err => {
      done(err, null);
    });
});

// init express
const app = new express();
const port = 3001;

// set-up the middlewares
app.use(morgan('dev'));
app.use(express.json());

const errorFormatter = ({ location, msg, param, value, nestedErrors }) => {
  // Format express-validate errors as strings
  return `${location}[${param}]: ${msg}`;
};

// custom middleware: check if a given request is coming from an authenticated user
const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated())
    return next();

  return res.status(401).json({ error: 'Not authenticated' });
}

// custom middleware: check if the request is valid 
const isValidate = (req, res, next) => {
  const err = validationResult(req).formatWith(errorFormatter); // format error message
  if (err.isEmpty())
    return next()
  else
    return res.status(422).json({ error: err.array().join(', ') });
}

// set up the session
app.use(session({
  // by default, Passport uses a MemoryStore to keep track of the sessions
  secret: '- Astra inclinant, sed non obligant -',
  resave: false,
  saveUninitialized: false
}));

// init passport
app.use(passport.initialize());
app.use(passport.session());



/*** AUTH APIs ***/

//POST /sessions
app.post('/api/sessions',
  function (req, res, next) {
    passport.authenticate('local', (err, user, info) => {
      if (err)
        return next(err);
      if (!user) {
        // display wrong login messages
        return res.status(401).json(info);
      }
      // success, perform the login
      req.login(user, (err) => {
        if (err)
          return next(err);

        // req.user contains the authenticated user
        return res.json(req.user);
      });
    })(req, res, next);
  });

//DELETE /sessions/current 
app.delete('/api/sessions/current',
  (req, res) => {
    req.logout();
    res.end();
  });


// GET /sessions/current
// check whether the user is logged in or not
app.get('/api/sessions/current',
  (req, res) => {
    if (req.isAuthenticated()) {
      res.status(200).json(req.user);
    }
    else
      res.status(401).json({ error: 'Unauthenticated user!' });;
  });



/*** API ***/

//GET /api/memes
app.get('/api/memes',
  isLoggedIn,
  async (req, res) => {
    memeDao.getMemes()
      //.then((memes) => res.status(200).json(memes))
      .then((memes) => res.status(200).json(memes))
      .catch((err) => res.status(500).json({ error: 'Database error' }))
  });

//GET /api/memes/public
app.get('/api/memes/public',
  async (req, res) => {
    memeDao.getPublicMemes()
      .then((memes) => res.json(memes))
      .catch((err) => res.status(500).json({ error: 'Database error' }))
  });

//GET /api/images
app.get('/api/images',
  isLoggedIn,
  async (req, res) => {
    memeDao.getImages()
      .then((images) => res.status(200).json(images))
      .catch((err) => res.status(500).json({ error: 'Database error' }))
  });

//POST /api/memes
app.post(
  '/api/memes',
  isLoggedIn,
  postMemesValidator(),
  isValidate,
  async (req, res) => {

    const meme = {
      image: req.body.image,
      title: req.body.title,
      phrases: req.body.phrases.map((item) => ({ id: item.id, text: item.text })),
      protect: req.body.protect,
      color: req.body.color,
      font: req.body.font
    }

    memeDao.createMeme(req.user.id, meme)
      .then(() => res.status(200).json({}))
      .catch((err) => res.status(500).json({ error: `Database error during the creation of meme` }))
  }
);

//DELETE /api/memes/<id>
app.delete('/api/memes/:id',
  isLoggedIn,
  deleteMemesValidator(),
  isValidate,
  async (req, res) => {
    memeDao.deleteMeme(req.user.id, req.params.id)
      .then(() => res.status(200).json({}))
      .catch((err) => res.status(500).json({ error: `Database error during the deletion of meme ${req.params.id}` }))
  });




// activate the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
