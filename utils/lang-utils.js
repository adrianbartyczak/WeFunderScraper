/**
 * File:
 *   lang-utils.js
 * 
 * Description:
 *   Languate utilities
 */

module.exports = {

  /**
   * Set a timeout for a promise.
   * @param {Object} promise       The promise to wait for
   * @param {Number} milliseconds  The number of milliseconds to wait
   */
  timeout: function(milliseconds, promise) {
    return new Promise(function (resolve, reject) {
      setTimeout(function () {
        reject(new Error('timeout'));
      }, milliseconds);
      promise.then(resolve, reject);
    });
  },
  
  /**
   * Sleep for the given number of milliseoncds.
   * @param {Number} milliseconds  The number of milliseconds to sleep
   */
  sleep: function(milliseconds) {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
  }

}
