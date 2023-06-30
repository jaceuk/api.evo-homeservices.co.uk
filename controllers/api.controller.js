const reviewsModel = require('../models/reviews.model.js');

exports.reviews = (req, res, next) => {
  const reviews = reviewsModel.getAll();

  res.send(reviews);
};
