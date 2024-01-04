const schedule = require('node-schedule');
const scraper = require('./latestReviews.scraper.js');
const sendEmail = require('./sendEmail.js');

const EMAIL_FROM = 'noreply@evo-homeservices.co.uk';
const EMAIL_TO = 'jnewington@gmail.com';
const CHECKATRADE_ACCOUNTS = [
  'evoplumbingheatinganddrainage',
  'evoplumbingheatinganddrainageburgesshill',
  'evoplumbingheatinganddrainage241077',
];

// * minute * hour * day of month * month * day of week
// const TIME = '0 1 * * 1';
const TIME = '40 13 * * *';

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
}

schedule.scheduleJob(TIME, async function () {
  // get latest reviews for each checkatrade account
  CHECKATRADE_ACCOUNTS.forEach(async (checkatradeAccount) => {
    const result = await scraper.scrape(checkatradeAccount).catch((error) => {
      sendError(checkatradeAccount, error);
    });
    sendImportReport(checkatradeAccount, result);
  });
});
