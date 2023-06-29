const reviewsModel = require('../models/reviews.model.js');

exports.getAll = async (req, res, next) => {
  const reviews = await reviewsModel.getAll();

  res.render('reviews', {
    title: 'Reviews',
    reviews: reviews,
  });
};
