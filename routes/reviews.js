var express = require('express');
var router = express.Router();
var reviewsController = require('../controllers/reviews.controller');

router.get('/', reviewsController.getAll);

module.exports = router;
