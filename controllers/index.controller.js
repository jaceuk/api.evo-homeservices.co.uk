const usersModel = require('../models/users.model.js');
const reviewsModel = require('../models/reviews.model.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.homePage = (req, res, next) => {
  const reviews = reviewsModel.getAll();

  res.render('index', {
    reviewsTotal: reviews.length,
    messageType: req.flash('messageType'),
    message: req.flash('message'),
  });
};

exports.loginPage = (req, res, next) => {
  res.render('login', {
    messageType: req.flash('messageType'),
    message: req.flash('message'),
  });
};

exports.login = async (req, res, next) => {
  let isMatch;
  const user = await usersModel.getUser(req.body.email);

  if (user) isMatch = await bcrypt.compare(req.body.password, user.password);

  if (!isMatch) {
    res.render('login', {
      user: req.body,
      messageType: 'danger',
      message: 'Incorrect Email and/or Password.',
    });
    return;
  }

  const payload = {
    userId: user.id.toString(),
    username: user.name,
  };
  const accessToken = jwt.sign(payload, process.env.SECRET_JWT, {
    expiresIn: process.env.SECRET_JWT_EXPIRES,
  });

  // store token in session
  req.session.accessToken = accessToken;
  // store variables in session to identify if logged in in the templates
  req.session.admin = user.admin;
  req.session.userId = user.id;
  req.session.username = user.name;

  req.flash('messageType', 'success');
  req.flash('message', 'Login successful, welcome back ' + user.name);
  res.redirect('/');
  return;
};

exports.logout = (req, res, next) => {
  req.session.destroy();
  res.redirect('/login');
  return;
};
