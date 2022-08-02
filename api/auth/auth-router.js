const router = require('express').Router();
const authMod = require('./auth-model');
const validate = require('../middleware/auth-middleware');
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {SECRET} = require('../../env');

router.post('/register', validate.shape, validate.uniqueUsername, (req, res, next) => {
  const {username, password} = req.user;
  const hash = bcryptjs.hashSync(password, 8)
  authMod.create({username, password: hash})
    .then(user => res.status(201).json(user))
    .catch(next)
  /*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.
    DO NOT EXCEED 2^8 ROUNDS OF HASHING!
    1- In order to register a new account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel", // must not exist already in the `users` table
        "password": "foobar"          // needs to be hashed before it's saved
      }
    2- On SUCCESSFUL registration,
      the response body should have `id`, `username` and `password`:
      {
        "id": 1,
        "username": "Captain Marvel",
        "password": "2a$08$jG.wIGR2S4hxuyWNcBf9MuoC4y0dNy7qC/LbmtuFBSdIhWks2LhpG"
      }
    3- On FAILED registration due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".
    4- On FAILED registration due to the `username` being taken,
      the response body should include a string exactly as follows: "username taken".
  */

});

router.post('/login', validate.shape, async (req, res, next) => {
  try {
  const {username, password} = req.user;
  const invalid = {message: 'invalid credentials'};
    let result = await authMod.findBy({username});
    if(!result || !bcryptjs.compareSync(password, result.password)) return res.status(404).json(invalid);
    const token = generateToken(req.user);
    res.json({
      token,
      message: `welcome, ${username}`
    })
  } catch(err) {
    next(err)
  }

  /*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.
    1- In order to log into an existing account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel",
        "password": "foobar"
      }
    2- On SUCCESSFUL login,
      the response body should have `message` and `token`:
      {
        "message": "welcome, Captain Marvel",
        "token": "eyJhbGciOiJIUzI ... ETC ... vUPjZYDSa46Nwz8"
      }
    3- On FAILED login due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".
    4- On FAILED login due to `username` not existing in the db, or `password` being incorrect,
      the response body should include a string exactly as follows: "invalid credentials".
  */
});

function generateToken(user) {
    const payload = { 
      subject: user.id,
      username: user.username
    }
    return jwt.sign(payload, SECRET, {expiresIn: '10m'})
}

module.exports = router;