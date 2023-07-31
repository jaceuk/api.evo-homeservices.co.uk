const fs = require('fs-extra');
const puppeteer = require('puppeteer');
const reviews = require('./utils/reviews.js');
const utils = require('./utils/utils.js');
const reviewsModel = require('../models/reviews.model.js');

// checkatrade accounts
// evoplumbingheatinganddrainage
// evoplumbingheatinganddrainageburgesshill
// evoplumbingheatinganddrainage241077

const SCRAPE_DELAY = 1000; // 1 sec
const CHECKATRADE_ACCOUNT = 'evoplumbingheatinganddrainage241077';
const SCORE_THRESHOLD = 9;

(async () => {
  let output = {
    reviewsAdded: 0,
  };

  // we only need to grab reviews from the past month
  // to be on the safe side the cut-off date will be the past two months
  const currentDate = new Date();
  let cutOffDate = currentDate.setDate(currentDate.getDate() - 42);
  cutOffDate = utils.formatDate(cutOffDate);

  // Launch the browser
  const browser = await puppeteer.launch({ headless: 'new' });

  // Create a page
  const page = await browser.newPage();

  let stopImport = false;
  // setup to go through the first 5 pages (50 reviews)
  // realistically the latest reviews will be in the first few pages so we won't scrape all 10
  for (let i = 1; i <= 5; i++) {
    // skip if we've found a duplicate
    if (stopImport) break;
    console.log(`Grabbing results for page ${i}`);

    // get the results page
    await page.goto(
      `https://www.checkatrade.com/trades/${CHECKATRADE_ACCOUNT}/reviews?page=${i}`
    );

    // get the reviews from the results page
    const nextTenReviews = await reviews.getReviews(page, SCORE_THRESHOLD);

    // go through reach review
    nextTenReviews.forEach(async (review) => {
      // we're only interested in reviews within the cutoff period
      if (review.date < cutOffDate) return (stopImport = true);

      // check if the review is already in the database
      const alreadyExists = await reviewsModel.alreadyExists(
        review.title,
        review.text
      );

      // if the review isn't already in the database then add it
      if (!alreadyExists) {
        await reviewsModel.add(
          review.date,
          review.postcode,
          review.title,
          review.text
        );
        // increase the count for reviews that have been added to the database
        output.reviewsAdded++;
      }

      // pause between scrapes
      await utils.delay(SCRAPE_DELAY);
    });
  }

  // Close browser.
  await browser.close();

  console.log(`Reviews added: ${output.reviewsAdded}`);

  process.exit();
  return output;
})();
