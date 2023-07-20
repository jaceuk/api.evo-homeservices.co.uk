const nodemailer = require('nodemailer');
const axios = require('axios');
const checkatradeModel = require('../models/checkatrade.model.js');
const reviewsModel = require('../models/reviews.model.js');
const locationsModel = require('../models/locations.model.js');
const countiesModel = require('../models/counties.model.js');
const servicesModel = require('../models/services.model.js');
const keywordsModel = require('../models/keywords.model.js');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// verify connection configuration
transporter.verify((err, success) => {
  err
    ? console.log(err)
    : console.log(`=== Server is ready to take messages: ${success} ===`);
});

exports.checkatrade = async (req, res, next) => {
  const checkatrade = await checkatradeModel.getAll();

  res.json(checkatrade);
};

exports.reviews = async (req, res, next) => {
  const reviews = await reviewsModel.getAll();

  res.json(reviews);
};

exports.locations = async (req, res, next) => {
  const locations = await locationsModel.getAll();

  res.json(locations);
};

exports.locationsInSameCounty = async (req, res, next) => {
  const locationsInSameCounty = await locationsModel.getLocationsInSameCounty(
    req.params.id
  );

  res.json(locationsInSameCounty);
};

exports.counties = async (req, res, next) => {
  const counties = await countiesModel.getAll();

  res.json(counties);
};

exports.county = async (req, res, next) => {
  const counties = await countiesModel.getById(req.params.id);

  res.json(counties);
};

exports.servicesByWebsite = async (req, res, next) => {
  const services = await servicesModel.getByWebsite(req.params.id);

  res.json(services);
};

exports.keywordsByWebsite = async (req, res, next) => {
  const keyword = await keywordsModel.getByWebsite(req.params.id);

  res.json(keyword);
};

exports.keywordsByService = async (req, res, next) => {
  const keyword = await keywordsModel.getByService(req.params.id);

  res.json(keyword);
};

exports.verify = async (req, res, next) => {
  const captchaURL = 'https://www.google.com/recaptcha/api/siteverify';
  // Get the token from the form
  const key = req.body['gRecaptchaResponse'];

  if (!key) res.json({ status: 400 });

  const response = await axios({
    url: captchaURL,
    method: 'POST',
    // reCaptcha demands x-www-form-urlencoded requests
    headers: {
      ContentType: 'application/x-www-form-urlencoded; charset=utf-8',
    },
    params: {
      secret: process.env.RECAPTCHA_SECRET_KEY,
      response: key,
    },
  }).catch((error) => {
    console.log(error);
  });

  const data = response.data;

  // check if successfully requested, and that a score over .3 is met
  if (data.success === true && data.score > 0.3) {
    res.json({
      status: 200,
    });
  } else {
    res.json({
      status: 500,
    });
  }
};

exports.send = (req, res, next) => {
  const { email, tel, message, site, page } = req.body;

  if (!email || !tel || message || site || page) res.json({ status: 500 });

  const mailOptions = {
    from: 'noreply@evo-homeservices.co.uk',
    to: 'info@evo-homeservices.co.uk',
    bcc: 'forms@revolvedigital.co.uk',
    replyTo: email,
    subject: site,
    html: `<p><strong>Email: </strong> ${email}</p>
      <p><strong>Tel: </strong> ${tel}</p>
      <p><strong>Message: </strong> ${message}</p>
      <p><strong>Originating page: </strong> ${page}</p>
    `,
  };

  transporter.sendMail(mailOptions, function (err, data) {
    if (err) {
      res.json({
        status: 500,
      });
    } else {
      console.log('== Message Sent ==');
      res.json({
        status: 200,
      });
    }
  });
};
