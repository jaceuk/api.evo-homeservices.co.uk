const reviewsModel = require('../models/reviews.model.js');

exports.homePage = async (req, res, next) => {
  const reviews = await reviewsModel.getAll();

  res.render('reviews/list', {
    title: 'Reviews',
    reviews: reviews,
    messageType: req.flash('messageType'),
    message: req.flash('message'),
  });
};

exports.addPage = async (req, res, next) => {
  const postcodes = await reviewsModel.getPostcodes();

  res.render('reviews/form', {
    title: 'Add new review ',
    postcodes: postcodes,
    formAction: '/reviews/add',
  });
};

exports.add = async (req, res, next) => {
  const postcodes = await reviewsModel.getPostcodes();

  // if review already exists then don't allow it, we don't want duplicates
  const alreadyExists = await reviewsModel.alreadyExists(
    req.body.title,
    req.body.text
  );

  if (alreadyExists) {
    res.render('reviews/form', {
      title: 'Add new review ',
      postcodes: postcodes,
      formAction: '/reviews/add',
      review: req.body,
      messageType: 'danger',
      message: 'There is already a review with the same Title and Text.',
    });
    return;
  }

  const result = await reviewsModel.add(
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
    formAction: '/reviews/add',
    review: req.body,
    messageType: 'danger',
    message: 'Something went wrong, please try again.',
  });
};

exports.delete = async (req, res, next) => {
  const result = await reviewsModel.delete(req.params.id);

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

exports.edit = async (req, res, next) => {
  const postcodes = await reviewsModel.getPostcodes();

  const result = await reviewsModel.get(req.params.id);

  res.render('reviews/form', {
    title: 'Edit review ',
    postcodes: postcodes,
    review: result,
    formAction: '/reviews/update',
  });
};

exports.update = async (req, res, next) => {
  const postcodes = await reviewsModel.getPostcodes();

  // if review already exists then don't allow it, we don't want duplicates
  const alreadyExists = await reviewsModel.alreadyExists(
    req.body.title,
    req.body.text
  );

  if (alreadyExists) {
    res.render('reviews/form', {
      title: 'Edit review ',
      postcodes: postcodes,
      formAction: '/reviews/update',
      review: req.body,
      messageType: 'danger',
      message: 'There is already a review with the same Title and Text.',
    });
    return;
  }

  const result = await reviewsModel.update(
    req.body.date,
    req.body.postcode,
    req.body.title,
    req.body.text,
    req.body.id
  );

  if (result) {
    req.flash('messageType', 'success');
    req.flash('message', 'Review updated.');
    res.redirect('/reviews');
    return;
  }

  res.render('reviews/form', {
    title: 'Edit review ',
    postcodes: postcodes,
    formAction: '/reviews/update',
    review: req.body,
    messageType: 'danger',
    message: 'Something went wrong, please try again.',
  });
};
