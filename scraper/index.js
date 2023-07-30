const schedule = require('node-schedule');
const scraper = require('./latestReviews.scraper.js');
const sendEmail = require('./sendEmail.js');

const EMAIL_FROM = 'noreply@evo-homeservices.co.uk';
const EMAIL_TO = 'jnewington@gmail.com';
const CHECKATRADE_ACCOUNT_1 = 'evoplumbingheatinganddrainage';
const CHECKATRADE_ACCOUNT_2 = 'evoplumbingheatinganddrainageburgesshill';
const CHECKATRADE_ACCOUNT_3 = 'evoplumbingheatinganddrainage241077';

// * minute * hour * day of month * month * day of week
const CHECKATRADE_ACCOUNT_1_TIME = '00 01 * * *';

if (CHECKATRADE_ACCOUNT_1_TIME) {
  schedule.scheduleJob(CHECKATRADE_ACCOUNT_1_TIME, async function () {
    const result = await scraper
      .scrape(CHECKATRADE_ACCOUNT_1)
      .catch((error) => {
        sendError(CHECKATRADE_ACCOUNT_1, error);
      });
    sendImportReport(CHECKATRADE_ACCOUNT_1, result);
  });
}

async function sendImportReport(checkatradeAccount, result) {
  const from = EMAIL_FROM;
  const to = EMAIL_TO;
  const replyTo = EMAIL_FROM;
  const bcc = '';
  const subject = 'Monthly import - ' + checkatradeAccount;
  const html = `<p><strong>New reviews added from https://www.checkatrade.com/trades/${checkatradeAccount}: </strong>${result.reviewsAdded}</p>`;

  // send email
  const emailSent = await sendEmail(from, to, subject, html, replyTo, bcc);

  if (!emailSent || emailSent.rejected != '')
    throw 'There was a problem sending your enquiry, please try again.';
}

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
