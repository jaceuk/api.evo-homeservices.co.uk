const checkatradeModel = require('../models/checkatrade.model.js');
const reviewsModel = require('../models/reviews.model.js');
const locationsModel = require('../models/locations.model.js');
const countiesModel = require('../models/counties.model.js');
const servicesModel = require('../models/services.model.js');
const keywordsModel = require('../models/keywords.model.js');

exports.checkatrade = (req, res, next) => {
  const checkatrade = checkatradeModel.getAll();

  res.json(checkatrade);
};

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

exports.servicesByWebsite = (req, res, next) => {
  const services = servicesModel.getByWebsite(req.params.id);

  res.json(services);
};

exports.keywordsByWebsite = (req, res, next) => {
  const keyword = keywordsModel.getByWebsite(req.params.id);

  res.json(keyword);
};

exports.keywordsByService = (req, res, next) => {
  const keyword = keywordsModel.getByService(req.params.id);

  res.json(keyword);
};
