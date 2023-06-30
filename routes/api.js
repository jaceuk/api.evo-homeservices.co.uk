var express = require('express');
var router = express.Router();
var apiController = require('../controllers/api.controller');

router.get('/reviews', apiController.reviews);

module.exports = router;
