# Auotmatic updating

Every week the scraper\index.js will automatically run (internal cron handled by node, NOT an external scheduled task) and get the latest reviews and email the results.

After that a cron job will run on the server to rebuild all three sites.
