var express = require('express');
var router = express.Router();
var reviewsController = require('../controllers/reviews.controller');
const { auth } = require('../middleware/auth.middleware');

router.get('/', auth, reviewsController.homePage);
router.get('/add', auth, reviewsController.addPage);
router.post('/add', auth, reviewsController.add);
router.get('/delete/:id', auth, reviewsController.delete);
router.get('/edit/:id', auth, reviewsController.edit);
router.post('/update', auth, reviewsController.update);

module.exports = router;
