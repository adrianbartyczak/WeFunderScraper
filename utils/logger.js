/**
 * File:
 *   logger.js
 * 
 * Description:
 *   The logger
 */

import Log from 'loglevel';
import {AppConstants} from '../constants';

Log.enableAll();

/**
 * Get the log header.
 * @param {Number} logLevel The log level
 * @return {String} The log header
 */
function getLogHeader(logLevel, tag) {
  const currDate = new Date();
  const currDateStrn =
    currDate.getHours() + ':' + currDate.getMinutes() + ':' + currDate.getSeconds() + ':' + currDate.getMilliseconds();
  return currDateStrn + ' ' + Object.keys(Log.levels)[logLevel] + ' [' + tag + '] ';
}

/**
 * Create a trace log.
 * @param {String} tag     The log tag
 * @param {String} message The log message
 */
export function trace(tag, message) {
  if (AppConstants.ENABLE_LOG) {
    Log.trace(getLogHeader(Log.levels.TRACE, tag) + message);
  }
}

/**
 * Create a debug log.
 * @param {String} tag     The log tag
 * @param {String} message The log message
 */
export function debug(tag, message) {
  if (AppConstants.ENABLE_LOG) {
    Log.debug(getLogHeader(Log.levels.DEBUG, tag) + message);
  }
}

/**
 * Create an info log.
 * @param {String} tag     The log tag
 * @param {String} message The log message
 */
export function info(tag, message) {
  if (AppConstants.ENABLE_LOG) {
    Log.info(getLogHeader(Log.levels.INFO, tag) + message);
  }
}

/**
 * Create an warn log.
 * @param {String} tag     The log tag
 * @param {String} message The log message
 */
export function warn(tag, message) {
  if (AppConstants.ENABLE_LOG) {
    Log.warn(getLogHeader(Log.levels.WARN, tag) + message);
  }
}

/**
 * Create an error log.
 * @param {String} tag     The log tag
 * @param {String} message The log message
 */
export function error(tag, message) {
  if (AppConstants.ENABLE_LOG) {
    Log.error(getLogHeader(Log.levels.ERROR, tag) + message);
  }
}

export default {
  trace,
  debug,
  info,
  warn,
  error, 
};
