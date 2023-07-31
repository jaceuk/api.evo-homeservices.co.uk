const utils = require('./utils.js');

function formatPostcode(oldPostcode) {
  let postcode = oldPostcode;
  if (oldPostcode && oldPostcode.length > 4) postcode = null;
  return postcode;
}

function cleanContent(string) {
  if (!string) return;

  string = string.replace('\n', ' ');
  string = string.replace(/\u00A0/g, ' ');
  string = string.replace(/\s\s+/g, ' ');

  const firstChar = string.charAt(0);
  if (firstChar === '"') string = string.slice(1);

  const lastChar = string.charAt(string.length - 1);
  if (lastChar === '"') string = string.slice(0, string.length - 1);

  return string;
}

exports.getTotalReviews = async (page) => {
  let totalReviews;
  const element = await page.waitForSelector('h3');
  const customerReviewsText = await page.evaluate(
    (el) => el.textContent,
    element
  );
  totalReviews = parseInt(
    customerReviewsText.replace('Customer Reviews (', '').replace(')', '')
  );
  await element.dispose();

  return totalReviews;
};

exports.getReviews = async (page, scoreThreshold) => {
  // Go through each page and grab the reviews cards (data-guid="ReviewsCard")
  // get the title (data-guid="ReviewsCard" h3)
  // get the postcode (data-guid="ReviewsCard" div.sc-248f0f6-9 div:first-child span)
  // get the text (data-guid="ReviewsCard" p)
  // get the date (data-guid="ReviewsCard" div.sc-248f0f6-9 div:last-child span)
  const titles = await page.evaluate(() =>
    Array.from(
      document.querySelectorAll('[data-guid="ReviewsCard"] h3'),
      (element) => element.textContent
    )
  );
  const text = await page.evaluate(() =>
    Array.from(
      document.querySelectorAll('[data-guid="ReviewsCard"] p'),
      (element) => element.textContent
    )
  );
  const postcodes = await page.evaluate(() =>
    Array.from(
      document.querySelectorAll(
        '[data-guid="ReviewsCard"] div.sc-248f0f6-9 div:first-child span'
      ),
      (element) => element.textContent
    )
  );
  const dates = await page.evaluate(() =>
    Array.from(
      document.querySelectorAll(
        '[data-guid="ReviewsCard"] div.sc-248f0f6-9 div:last-child span'
      ),
      (element) => element.textContent
    )
  );
  const scores = await page.evaluate(() =>
    Array.from(
      document.querySelectorAll('svg text'),
      (element) => element.textContent
    )
  );

  // build array of reviews
  let reviews = [];
  for (let i = 0; i < titles.length; i++) {
    const formattedPostcode = formatPostcode(postcodes[i]);
    const formattedText = cleanContent(text[i]);
    const formattedTitle = cleanContent(titles[i]);
    const formattedDate = utils.formatDate(dates[i]);

    const review = {
      title: formattedTitle,
      text: formattedText,
      postcode: formattedPostcode,
      date: formattedDate,
    };
    if (
      scores[i] >= scoreThreshold &&
      formattedText &&
      formattedPostcode &&
      formattedTitle &&
      formattedDate
    )
      reviews.push(review); // only include reviews above 9 and no empty fields
  }

  return reviews;
};
