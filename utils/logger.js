/**
 * @desc Logger，info，error，后期可以追加错误上报
 * @author liqiang
 * @company fivefire
 * @date 28 Nov 2017
 */

'use strict'

// OPTIMIZE: 错误日志上报
class Logger {
  log () {
    console.log.apply(console, Array.prototype.slice.call(arguments))
  }

  info () {
    console.info.apply(console, Array.prototype.slice.call(arguments))
  }

  error () {
    console.error.apply(console, Array.prototype.slice.call(arguments))
  }

  warn () {
    console.warn.apply(console, Array.prototype.slice.call(arguments))
  }

  debug () {
    console.debug.apply(console, Array.prototype.slice.call(arguments))
  }
}

module.exports = new Logger()
