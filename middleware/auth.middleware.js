const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.auth = (req, res, next) => {
  // turn off auth on development
  if (process.env.NODE_ENV === 'development') {
    req.session.admin = 1;
    req.session.userId = 1;
    req.session.username = 'Test Admin';
    next();
    return;
  }

  try {
    let accessToken = req.session.accessToken;
    //if there is no token stored in session, the request is unauthorized
    if (!accessToken) {
      res.redirect('/login');
      return;
    }
    //use the jwt.verify method to verify the access token
    //throws an error if the token has expired or has a invalid signature
    jwt.verify(accessToken, process.env.SECRET_JWT);
    next();
  } catch (e) {
    // token expired, log the user out
    res.redirect('/logout');
    return;
  }
};

// only allow admin access
exports.authAdmin = (req, res, next) => {
  if (req.session.admin != 1) return res.redirect('/');
  next();
};
