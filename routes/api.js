var express = require('express');
var router = express.Router();
var apiController = require('../controllers/api.controller');

router.get('/checkatrade', apiController.checkatrade);
router.get('/locations', apiController.locations);
router.get('/locations/county/:id', apiController.locationsInSameCounty);
router.get('/counties', apiController.counties);
router.get('/county/:id', apiController.county);
router.get('/services/website/:id', apiController.servicesByWebsite);
router.get('/reviews', apiController.reviews);
router.get('/keywords/website/:id', apiController.keywordsByWebsite);
router.get('/keywords/service/:id', apiController.keywordsByService);
router.post('/verify', apiController.verify);
router.post('/send', apiController.send);

module.exports = router;
