var express = require('express');
var router = express.Router();
var apiController = require('../controllers/api.controller');

router.get('/reviews', apiController.reviews);
router.get('/locations', apiController.locations);
router.get('/locations/county/:id', apiController.locationsInSameCounty);
router.get('/counties', apiController.counties);
router.get('/services', apiController.services);

module.exports = router;
