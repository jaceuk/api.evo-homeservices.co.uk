var express = require('express');
var router = express.Router();
var reviewsController = require('../controllers/reviews.controller');

router.get('/', reviewsController.getAll);

router.post('/postcodes', reviewsController.addPostcodes);

module.exports = router;
