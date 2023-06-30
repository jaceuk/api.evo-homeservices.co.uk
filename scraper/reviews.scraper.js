// Import puppeteer
import puppeteer from 'puppeteer';

const resultsPerPage = 10;

(async () => {
  // Launch the browser
  const browser = await puppeteer.launch({ headless: 'new' });

  // Create a page
  const page = await browser.newPage();

  // Go to your site
  await page.goto('https://www.checkatrade.com/trades/evoplumbingheatinganddrainage241077/reviews?page=1');

  // get number of results
  let totalResults;
  try {
    const element = await page.waitForSelector('h3');
    const customerReviewsText = await page.evaluate((el) => el.textContent, element);
    totalResults = parseInt(customerReviewsText.replace('Customer Reviews (', '').replace(')', ''));
    await element.dispose();
  } catch (error) {
    throw new Error(error);
  }

  // divde total results by results per page to get the total number of pages
  const totalPages = Math.floor(totalResults / resultsPerPage);

  console.log(totalPages);

  // click the 'show more' button XX times to show all dogs on the same page

  // get all the dog page links from the cards
  // const pageLinks = await page.$$eval(
  //   ".DogListingCard-module--dogcardcontainer--caada a",
  //   (elements) => elements.map((item) => item.href)
  // );
  // console.log(pageLinks);

  // Close browser.
  await browser.close();
})();
