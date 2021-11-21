/**
 * File:
 *   rest-utils.js
 * 
 * Description:
 *   REST utilities
 */

const request = require('request-promise');
const cheerio = require('cheerio');

module.exports = {

  /**
   * Make a GET request
   * @param {Object} uri           The URI of the request
   */
  makeGetRequest: async function(uri) {
    const options = {
      uri: uri,
      transform: function(body) {
        return cheerio.load(body);
      }
    };
    // Returns a Cheerio loaded element.
    return await request(options);
  }

}
