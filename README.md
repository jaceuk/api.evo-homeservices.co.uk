# Auotmatic updating

Every week a server cron job will run 'npm run scrape' and get the latest reviews and then email the results.

A server cron job will run once a month to rebuild all three sites.

## local testing

Running the server locally will start scraper\index.js which will automatically run at set times (internal cron handled by node, NOT an external scheduled task) and get the latest reviews and email the results.

Alternatively you can just run 'npm run scrape' to get the latest reviews and email the results.
