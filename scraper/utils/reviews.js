const utils = require('./utils.js');

function formatPostcode(oldPostcode) {
  return oldPostcode.replace('Location: ', '');
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

exports.getReviews = async (page, scoreThreshold) => {
  // Go through each page and grab the reviews
  const titles = await page.evaluate(() =>
    Array.from(
      document.querySelectorAll('ul[aria-label="Reviews"] li h4'),
      (element) => element.textContent
    )
  );
  const text = await page.evaluate(() =>
    Array.from(
      document.querySelectorAll('ul[aria-label="Reviews"] li p'),
      (element) => element.textContent
    )
  );
  const postcodes = await page.evaluate(() =>
    Array.from(
      document.querySelectorAll('ul[aria-label="Reviews"] li address'),
      (element) => element.textContent
    )
  );
  const dates = await page.evaluate(() =>
    Array.from(
      document.querySelectorAll('ul[aria-label="Reviews"] li time'),
      (element) => element.textContent
    )
  );
  const scores = await page.evaluate(() =>
    Array.from(
      document.querySelectorAll(
        'ul[aria-label="Reviews"] li span[aria-label^="Review score"]'
      ),
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
