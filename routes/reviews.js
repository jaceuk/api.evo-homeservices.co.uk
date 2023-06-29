var express = require('express');
var router = express.Router();
var reviewsController = require('../controllers/reviews.controller');

router.get('/', reviewsController.getAll);
router.get('/add', reviewsController.getAdd);
router.post('/add', reviewsController.add);
router.get('/delete/:id', reviewsController.delete);
router.get('/edit/:id', reviewsController.edit);
router.post('/update', reviewsController.update);

module.exports = router;
