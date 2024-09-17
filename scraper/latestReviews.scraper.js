// NOTE: if there is a problem running puppeteer with locating Chromium
// run 'node node_modules/puppeteer/install.js' to force the installation

import puppeteer from 'puppeteer';
import { getReviews } from './utils/reviews.js';
import { formatDate, delay } from './utils/utils.js';
import { alreadyExists, add } from '../models/reviews.model.js';

const CLICK_DELAY = 4000; // 4 secs
const SCORE_THRESHOLD = 9;

export const scrape = async (checkatradeAccount) => {
  console.log(checkatradeAccount + 'scrape started ...');

  let output = {
    reviewsAdded: 0,
  };

  // we only need to grab reviews from the past month
  // to be on the safe side the cut-off date will be the past two months
  const currentDate = new Date();
  let cutOffDate = currentDate.setDate(currentDate.getDate() - 42);
  cutOffDate = formatDate(cutOffDate);

  // Launch the browser
  const browser = await puppeteer.launch({ headless: 'new' });

  // Create a page
  const page = await browser.newPage();

  // get the results page
  await page.goto(`https://www.checkatrade.com/trades/${checkatradeAccount}`);

  // locate the 'See more reviews' button
  const seeMoreButton = await page.$('button[data-guid="More reviews"]');

  // click on the 'See more reviews' button twice
  // this will return the 20 most recent reviews
  if (seeMoreButton) {
    await seeMoreButton.click();
    await delay(CLICK_DELAY);
    await seeMoreButton.click();
    await delay(CLICK_DELAY);
  }

  // get the reviews from the page
  const allReviews = await getReviews(page, SCORE_THRESHOLD);

  // go through reach review
  allReviews.forEach(async (review) => {
    // we're only interested in reviews within the cutoff period
    if (review.date < cutOffDate) return;

    // check if the review is already in the database
    const reviewAlreadyExists = await alreadyExists(review.title, review.text);

    // if the review isn't already in the database then add it
    if (!reviewAlreadyExists) {
      await add(review.date, review.postcode, review.title, review.text);
      // increase the count for reviews that have been added to the database
      output.reviewsAdded++;
    }
  });

  // Close browser.
  await browser.close();

  console.log(`Reviews added: ${output.reviewsAdded}`);

  console.log(checkatradeAccount + 'scrape ended!');

  return output;
};
