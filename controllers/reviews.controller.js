const reviewsModel = require('../models/reviews.model.js');

exports.getAll = (req, res, next) => {
  const reviews = reviewsModel.getAll();

  res.render('reviews/list', {
    title: 'Reviews',
    reviews: reviews,
    messageType: req.flash('messageType'),
    message: req.flash('message'),
  });
};

exports.getAdd = (req, res, next) => {
  const postcodes = reviewsModel.getPostcodes();

  res.render('reviews/form', {
    title: 'Add new review ',
    postcodes: postcodes,
  });
};

exports.add = (req, res, next) => {
  const postcodes = reviewsModel.getPostcodes();

  const result = reviewsModel.add(
    req.body.date,
    req.body.postcode,
    req.body.title,
    req.body.text
  );

  if (result) {
    req.flash('messageType', 'success');
    req.flash('message', 'Review added.');
    res.redirect('/reviews');
    return;
  }

  res.render('reviews/form', {
    title: 'Add new review ',
    postcodes: postcodes,
    review: req.body,
    messageType: 'danger',
    message: 'Something went wrong, please try again.',
  });
};

exports.delete = (req, res, next) => {
  const result = reviewsModel.delete(req.params.id);

  if (!result) {
    req.flash('messageType', 'danger');
    req.flash('message', 'Review not found.');
    res.redirect('/reviews');
    return;
  }

  req.flash('messageType', 'success');
  req.flash('message', 'Review deleted successfully.');
  res.redirect('/reviews');
};
