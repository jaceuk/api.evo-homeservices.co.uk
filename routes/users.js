var express = require('express');
var router = express.Router();
const { auth, authAdmin } = require('../middleware/auth.middleware');

/* GET users listing. */
router.get('/', auth, authAdmin, function (req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
