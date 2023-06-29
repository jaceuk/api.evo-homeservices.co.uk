const reviewsModel = require('../models/reviews.model.js');

exports.getAll = (req, res, next) => {
  const reviews = reviewsModel.getAll();

  res.render('reviews', {
    title: 'Reviews',
    reviews: reviews,
  });
};

exports.addPostcodes = (req, res, next) => {
  reviewsModel.addPostcodes();
};
