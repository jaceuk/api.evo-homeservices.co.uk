var express = require('express');
var router = express.Router();
var indexController = require('../controllers/index.controller');

router.get('/', indexController.homePage);
router.get('/login', indexController.loginPage);
router.post('/login', indexController.login);
router.get('/logout', indexController.logout);

module.exports = router;
