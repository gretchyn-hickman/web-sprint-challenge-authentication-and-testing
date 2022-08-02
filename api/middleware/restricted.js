const jwt = require('jsonwebtoken');
const { SECRET } = require('../../env')

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if(!authorization) return res.status(404).json({message: "token required"});
  jwt.verify(authorization, SECRET, (err, decodedToken) => {
    if(err) {
      return res.status(404).json({message: "token invalid"});
    };
    req.jwt = decodedToken;
    next();
  })
  /*
    IMPLEMENT
    1- On valid token in the Authorization header, call next.
    2- On missing token in the Authorization header,
      the response body should include a string exactly as follows: "token required".
    3- On invalid or expired token in the Authorization header,
      the response body should include a string exactly as follows: "token invalid".
  */
};