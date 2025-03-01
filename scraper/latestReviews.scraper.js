// NOTE: if there is a problem running puppeteer with locating Chromium
// run 'node node_modules/puppeteer/install.js' to force the installation

const puppeteerExtra = require('puppeteer-extra');
const pluginStealth = require('puppeteer-extra-plugin-stealth');
const reviews = require('./utils/reviews.js');
const utils = require('./utils/utils.js');
const reviewsModel = require('../models/reviews.model.js');

const CLICK_DELAY = 4000; // 4 secs
const SCORE_THRESHOLD = 9;

exports.scrape = async (checkatradeAccount) => {
  console.log(checkatradeAccount + ' scraping started ...');

  let output = {
    reviewsAdded: 0,
  };

  // Launch the browser
  puppeteerExtra.use(pluginStealth());
  const browser = await puppeteerExtra.launch({ headless: 'new' });

  // Create a page
  const page = await browser.newPage();

  // get the results page
  await page.goto(`https://www.checkatrade.com/trades/${checkatradeAccount}`);

  // locate the 'See all reviews' button and click it
  await page.$$eval('button', (buttons) => {
    for (const button of buttons) {
      if (button.textContent === 'See all reviews') {
        button.click();
        break; // Clicking the first matching button and exiting the loop
      }
    }
  });

  await utils.delay(CLICK_DELAY);

  // locate the 'Last 30 days' text and click on it to select the radio button
  // we only need to grab reviews from the past month
  await page.$$eval('span', (spans) => {
    for (const span of spans) {
      if (span.textContent === 'Last 30 days') {
        span.click();
        break; // Clicking the first matching button and exiting the loop
      }
    }
  });

  // locate the 'Show reviews' button and click on it
  await page.$$eval('button', (buttons) => {
    for (const button of buttons) {
      if (button.textContent === 'Show reviews') {
        button.click();
        break; // Clicking the first matching button and exiting the loop
      }
    }
  });

  await utils.delay(CLICK_DELAY);

  // click the 'Load more reviews' button until there are now more reviews
  const isElementVisible = async (page, cssSelector) => {
    let visible = true;
    await page
      .waitForSelector(cssSelector, { visible: true, timeout: 2000 })
      .catch(() => {
        visible = false;
      });
    return visible;
  };

  const selectorForLoadMoreButton = 'button[aria-label="Load more reviews"]';

  let loadMoreVisible = await isElementVisible(page, selectorForLoadMoreButton);
  while (loadMoreVisible) {
    await page.click(selectorForLoadMoreButton).catch(() => {});
    loadMoreVisible = await isElementVisible(page, selectorForLoadMoreButton);
  }

  // get the reviews from the page
  const allReviews = await reviews.getReviews(page, SCORE_THRESHOLD);

  // update database with new reviews
  // go through reach review
  allReviews.forEach(async (review) => {
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
  });

  // Close browser.
  await browser.close();

  console.log(`Reviews added: ${output.reviewsAdded}`);

  console.log(checkatradeAccount + ' scraping ended!');

  return output;
};
