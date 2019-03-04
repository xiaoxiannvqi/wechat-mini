/**
 * @desc api 请求时候的队列
 * @author liqiang
 * @company fivefire
 * @date 24 Nov 2017
 */

'use strict'

const logger = require('./logger')

class TaskQueue {
  constructor () {
    this.queue = []
  }

  add (task) {
    if (task) {
      this.queue.push(task)
    }
    return this
  }

  remove (task) {
    const taskIndex = this.queue.indexOf(task)
    if (taskIndex > -1) {
      const task = this.queue.splice(taskIndex, 1)
    }
    return this
  }

  clear () {
    let len = this.queue.length
    while (len--) {
      try {
        const abort = this.queue[len].abort
        abort && abort()
      } catch (err) {
        logger.error(err)
      }
    }
    this.queue = []
    return this
  }
}

module.exports = TaskQueue
