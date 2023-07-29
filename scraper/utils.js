exports.delay = (interval) =>
  new Promise((resolve) => setTimeout(resolve, interval));

function formatDate(oldDate) {
  const t = new Date(oldDate);
  const date = ('0' + t.getDate()).slice(-2);
  const month = ('0' + (t.getMonth() + 1)).slice(-2);
  const year = t.getFullYear();
  return `${year}-${month}-${date}`;
}

function formatPostcode(oldPostcode) {
  let postcode = oldPostcode;
  if (oldPostcode && oldPostcode.length > 4) postcode = null;
  return postcode;
}

function cleanContent(string) {
  if (!string) return;

  string = string.replace('\n', ' ');
  string = string.replace(/\u00A0/g, ' ');
  string = string.replace('  ', ' ');

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
    const review = {
      title: cleanContent(titles[i]),
      text: cleanContent(text[i]),
      postcode: formatPostcode(postcodes[i]),
      date: formatDate(dates[i]),
    };
    if (scores[i] >= scoreThreshold && text && postcode) reviews.push(review); // only include reviews above 9 and that have text and a postcode
  }

  return reviews;
};
