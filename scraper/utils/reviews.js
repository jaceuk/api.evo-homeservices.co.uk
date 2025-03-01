const utils = require('./utils.js');

function formatPostcode(oldPostcode) {
  return oldPostcode.replace('Job location: ', '');
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
      document.querySelectorAll('ul li h3'),
      (element) => element.textContent
    )
  );

  const text = await page.evaluate(() =>
    Array.from(
      document.querySelectorAll('ul li > div > div'),
      (element) => element.textContent
    )
  );

  let postcodes = await page.evaluate(() =>
    Array.from(
      document.querySelectorAll('ul li > span'),
      (element) => element.textContent
    )
  );
  // remove any empty values
  postcodes = postcodes.filter(function (e) {
    return e; // Returns only the truthy values
  });

  let dates = await page.evaluate(() =>
    Array.from(
      document.querySelectorAll('ul li > section > p'),
      (element) => element.textContent
    )
  );
  // remove any text
  dates = dates.filter(function (e) {
    return e.replace('Posted ', ''); // Returns cleaned up dates
  });

  const scores = await page.evaluate(() =>
    Array.from(
      document.querySelectorAll('ul li > section > span'),
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
      !formattedDate.includes('NaN')
    )
      reviews.push(review); // only include reviews above 9 and no empty fields
  }

  return reviews;
};
