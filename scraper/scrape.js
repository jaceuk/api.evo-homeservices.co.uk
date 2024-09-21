const scraper = require('./latestReviews.scraper.js');
const sendEmail = require('./sendEmail.js');

const EMAIL_FROM = 'noreply@evo-homeservices.co.uk';
const EMAIL_TO = 'jnewington@gmail.com';
const CHECKATRADE_ACCOUNTS = [
  'evoplumbingheatinganddrainage',
  'evoplumbingheatinganddrainageburgesshill',
  'evoplumbingheatinganddrainage241077',
];

// send email after successful import
async function sendImportReport(checkatradeAccount, result) {
  const from = EMAIL_FROM;
  const to = EMAIL_TO;
  const replyTo = EMAIL_FROM;
  const bcc = '';
  const subject = 'Overnight import - ' + checkatradeAccount;
  const html = `<p><strong>${result.reviewsAdded}</strong> new reviews added from https://www.checkatrade.com/trades/${checkatradeAccount}</p>`;

  // send email
  const emailSent = await sendEmail(from, to, subject, html, replyTo, bcc);

  if (!emailSent || emailSent.rejected != '')
    throw 'There was a problem sending your enquiry, please try again.';

  return;
}

// send email if there was an import error
async function sendError(checkatradeAccount, error) {
  const from = EMAIL_FROM;
  const to = EMAIL_TO;
  const replyTo = EMAIL_FROM;
  const bcc = '';
  const subject = 'Overnight import - ' + checkatradeAccount;
  const html = `<p><strong>Error importing reviews from https://www.checkatrade.com/trades/${checkatradeAccount}: </strong>${error}</p>`;

  // send email
  const emailSent = await sendEmail(from, to, subject, html, replyTo, bcc);

  if (!emailSent || emailSent.rejected != '')
    throw 'There was a problem sending your enquiry, please try again.';

  return;
}

(async () => {
  for (let i = 0; i < CHECKATRADE_ACCOUNTS.length; i++) {
    const result = await scraper
      .scrape(CHECKATRADE_ACCOUNTS[i])
      .catch((error) => {
        sendError(CHECKATRADE_ACCOUNTS[i], error);
      });
    await sendImportReport(CHECKATRADE_ACCOUNTS[i], result);
  }
})();

// CHECKATRADE_ACCOUNTS.forEach(async (checkatradeAccount) => {
//   const result = await scraper.scrape(checkatradeAccount).catch((error) => {
//     sendError(checkatradeAccount, error);
//   });
//   await sendImportReport(checkatradeAccount, result);
// });
