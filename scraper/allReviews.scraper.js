const fs = require('fs-extra');
const puppeteer = require('puppeteer');
const utils = require('./utils.js');
const reviewsModel = require('../models/reviews.model.js');
const reviews = require('./evoplumbingheatinganddrainage241077-reviews.json');

// checkatrade accounts
// evoplumbingheatinganddrainage
// evoplumbingheatinganddrainageburgesshill
// evoplumbingheatinganddrainage241077

const RESULTS_PER_PAGE = 10;
const SCRAPE_DELAY = 1000; // 1 sec
const CHECKATRADE_ACCOUNT = 'evoplumbingheatinganddrainage';
const SCORE_THRESHOLD = 9;

(async () => {
  // // Launch the browser
  // const browser = await puppeteer.launch({ headless: 'new' });

  // // Create a page
  // const page = await browser.newPage();

  // // Go to the site
  // await page.goto(
  //   `https://www.checkatrade.com/trades/${CHECKATRADE_ACCOUNT}/reviews?page=1`
  // );

  // // get number of reviews
  // const totalReviews = await utils.getTotalReviews(page);
  // const totalPages = Math.floor(totalReviews / RESULTS_PER_PAGE);

  // // get reviews
  // let reviews = [];

  // for (let i = 1; i <= totalPages; i++) {
  //   // delay between each page fetch
  //   await utils.delay(SCRAPE_DELAY);
  //   await page.goto(
  //     `https://www.checkatrade.com/trades/${CHECKATRADE_ACCOUNT}/reviews?page=${i}`
  //   );
  //   const nextTenReviews = await utils.getReviews(page, SCORE_THRESHOLD);
  //   reviews.push(...nextTenReviews);
  // }

  // // Close browser.
  // await browser.close();

  // // save reviews to file
  // const contents = JSON.stringify(reviews);
  // const path = `./${CHECKATRADE_ACCOUNT}-reviews.json`;
  // fs.writeFile(path, contents, function (err) {
  //   if (err) return console.log(err);
  // });

  // add each review to the database
  let duplicates = 0;

  for (const review of reviews) {
    // if review already exists then skip, we don't want duplicates
    const alreadyExists = await reviewsModel.alreadyExists(
      review.title,
      review.text
    );

    if (alreadyExists) {
      duplicates++;
    } else {
      await reviewsModel.add(
        review.date,
        review.postcode,
        review.title,
        review.text
      );
    }
  }

  console.log(`${duplicates} duplicate reviews were skipped.`);
  process.exit();
})();
