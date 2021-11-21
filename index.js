/**
 * File:
 *   index.js
 * 
 * Description:
 *   The root file of the application
 */

const WefunderWebscraper = require('./webscrapers/wefunder-webscraper');

async function run() {
  WefunderWebscraper.run();
}

run();
