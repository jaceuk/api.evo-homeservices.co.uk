const reviewsModel = require('../models/reviews.model.js');
const locationsModel = require('../models/locations.model.js');
const countiesModel = require('../models/counties.model.js');
const servicesModel = require('../models/services.model.js');

exports.reviews = (req, res, next) => {
  const reviews = reviewsModel.getAll();

  res.json(reviews);
};

exports.locations = (req, res, next) => {
  const locations = locationsModel.getAll();

  res.json(locations);
};

exports.locationsInSameCounty = (req, res, next) => {
  const locationsInSameCounty = locationsModel.getLocationsInSameCounty(
    req.params.id
  );

  res.json(locationsInSameCounty);
};

exports.counties = (req, res, next) => {
  const counties = countiesModel.getAll();

  res.json(counties);
};

exports.services = (req, res, next) => {
  const services = servicesModel.getAll();

  res.json(services);
};
