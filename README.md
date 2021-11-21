# WeFunderScraper

Sample web scraper for https://wefunder.com.

It will scrape everything in the "Raising Now" section, and navigate to each company page and scrape that data too.

## Files

* [index.js](index.js): The root file of the project  
* [webscrapers/](webscrapers/): The webscrapers for different webpages (currently only wefunder.com)
* [sample-htmls/](sample-htmls/): Sample webpage HTML pages for faster testing  
* [utils/](utils/): Utilities  

## Run

1. Install node modules if you haven't already (`npm install`).

2. Run `node index.js` to run the application.
