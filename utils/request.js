/**
 * @desc Request
 * @author sunqi
 * @company fivefire
 * @date 14 Nov 2017
 */

'use strict'

const config = require('../config')
const util = require('./util')
const TaskQueue = require('./requestTaskQueue')
const logger = require('./logger')
const queue = new TaskQueue()

wx.onNetworkStatusChange(resp=> {
    if(!resp.isConnected){
        showError(null, '网络异常，请稍后重试')
    }
 })
/**
 * 显示请求错误
 * @param  {} title=''
 */
function showError (title = '', content = '') {
  util.showModal({
    title: title || '提示',
    content: content || '访问服务器出错',
    showCancel: false
  })
}

/**
 * 处理401未认证请求，直接重新登录获取token，并刷新当前页
 * 需要清除当前请求队列，防止重复获取token
 */
function unauthHandler () {
  queue.clear()
  const interfaces = require('../interface/index')
  return interfaces.login()
  .then(({ token, ...info }) => {
    if (token) {
      Promise.all([
        util.setLocalToken(token),
        util.setLocalUser(info)
      ]).then(() => {
        const pages = getCurrentPages()
        const currentPage = pages[pages.length - 1]
        return wx._reLaunch({ url: '/' + currentPage.__route__ })
      })
    }
  })
}

/**
 * request wrapper
 * @param  {} params={}  参数同wx.request，只多了一个params.loading参数，默认为true，控制接口请求是否显示loading
 * 
 * OPTIMIZE: wx.request其实返回了一个句柄，可以abort请求，但是目前promise化后暂时无法拿到句柄，不能abort，可能会造成带宽浪费
 */
const baseLoading = {
  mask: true,
  title: '加载中...'
}
function request (params = {}) {
    if(getApp().globalData.userStatus == 3 && !params.login){
        return util.showModal({
            title:'用户已被禁用',
            content:  '如需正常使用小程序，请您联系管理员'
        }).then(res => {

        })
    }

  let loading = params.loading
  // 如果自传了complete，loading必须强制设置为false，不管params中loading如何
  if (params.complete) {
    loading = false
  } else {
    if (typeof loading === 'boolean') {
      if (loading) {
        loading = baseLoading
      }
    } else {
      loading = Object.assign({}, baseLoading, params.loading)
    }
  }
  if (loading) {
    wx.showLoading(loading)
  }
  let task = null
  return new Promise((resolve, reject) => {
    const opts = Object.assign({}, {
      method: 'GET',
      header: {
        'Content-Type': 'application/json'
      },
      dataType: 'json',
      success (res) {
        // 全局处理请求结果
        if (res.statusCode === 200 || res.statusCode === 201) {
          // 接口内部返回的code处理
          if (['1', 1].includes(res.data.code)) {
            resolve(res.data)
          } else {
            // 接口处理异常
            showError(null, res.data.msg)
            reject(res)
          }
        } else if (res.statusCode === 401) {
          reject(res)
          // Unauthorized
          unauthHandler()
        } else {
          // 404 50X ...
          reject(res)
          showError()
        }
      },
      fail (err) {
        logger.error(err)
        reject(err)
        if (err.errMsg && err.errMsg.indexOf('timeout') > -1) {
          showError(null, '网络异常，请稍后重试')
        } else {
          showError()
        }
      },
      complete () {
        if (loading) {
          wx.hideLoading()
        }
        queue.remove(task)
      }
    }, params)
    // 获取本地session，并在每次请求时设置header中的token
    try {
      const token = wx.getStorageSync(config.storage.sessionKey)
      if (token) {
        opts.header.token = token
      }
    } catch (e) {
      logger.error(e)
    }
    task = wx.request(opts)
    queue.add(task)
  })
}
function requestPost (params = {}) {
    if(getApp().globalData.userStatus == 3 && !params.login){
        return util.showModal({
            title:'用户已被禁用',
            content:  '如需正常使用小程序，请您联系管理员'
        }).then(res => {

        })
    }
    let loading = params.loading
    // 如果自传了complete，loading必须强制设置为false，不管params中loading如何
    if (params.complete) {
        loading = false
    } else {
        if (typeof loading === 'boolean') {
            if (loading) {
                loading = baseLoading
            }
        } else {
            loading = Object.assign({}, baseLoading, params.loading)
        }
    }
    if (loading) {
        wx.showLoading(loading)
    }
    let task = null
    return new Promise((resolve, reject) => {
        const opts = Object.assign({}, {
            method: 'GET',
            header: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            dataType: 'json',
            success (res) {
                // 全局处理请求结果
                if (res.statusCode === 200 || res.statusCode === 201) {
                    // 接口内部返回的code处理
                    if (['1', 1].includes(res.data.code)) {
                        resolve(res.data)
                    } else {
                        // 接口处理异常
                        showError(null, res.data.msg)
                        reject(res)
                    }
                } else if (res.statusCode === 401) {
                    reject(res)
                    // Unauthorized
                    unauthHandler()
                } else {
                    // 404 50X ...
                    reject(res)
                    showError()
                }
            },
            fail (err) {
                logger.error(err)
                reject(err)
                if (err.errMsg && err.errMsg.indexOf('timeout') > -1) {
                    showError(null, '网络异常，请稍后重试')
                } else {
                    showError()
                }
            },
            complete () {
                if (loading) {
                    wx.hideLoading()
                }
                queue.remove(task)
            }
        }, params)
        // 获取本地session，并在每次请求时设置header中的token
        try {
            const token = wx.getStorageSync(config.storage.sessionKey)
            if (token) {
                opts.header.token = token
            }
        } catch (e) {
            logger.error(e)
        }
        task = wx.request(opts)
        queue.add(task)
    })
}
//循环请求，当请求失败后，循环请求
function loopRequest (params = {}) {
    let loading = params.loading
    // 如果自传了complete，loading必须强制设置为false，不管params中loading如何
    if (params.complete) {
        loading = false
    } else {
        if (typeof loading === 'boolean') {
            if (loading) {
                loading = baseLoading
            }
        } else {
            loading = Object.assign({}, baseLoading, params.loading)
        }
    }
    if (loading) {
        wx.showLoading(loading)
    }
    let task = null
    return new Promise((resolve, reject) => {
        const opts = Object.assign({}, {
            method: 'GET',
            header: {
                'Content-Type': 'application/json'
            },
            dataType: 'json',
            success (res) {

                // 全局处理请求结果
                if (res.statusCode === 200 || res.statusCode === 201) {
                    // 接口内部返回的code处理
                    if (['1', 1].includes(res.data.code)) {
                        resolve(res.data)
                    } else {
                        // 接口处理异常
                        //showError(null, res.data.msg)
                        reject(res)
                    }
                } else if (res.statusCode === 401) {
                    reject(res)
                    // Unauthorized
                    unauthHandler()
                } else {
                    // 404 50X ...
                    reject(res)
                   // showError()
                }
            },
            fail (err) {
                logger.error(err)
                reject(err)
                // if (err.errMsg && err.errMsg.indexOf('timeout') > -1) {
                //     //showError(null, '网络异常，请稍后重试')
                // } else {
                //     //showError()
                // }
            },
            complete () {
                if (loading) {
                    wx.hideLoading()
                }
                queue.remove(task)
            }
        }, params)
        // 获取本地session，并在每次请求时设置header中的token
        try {
            const token = wx.getStorageSync(config.storage.sessionKey)
            if (token) {
                opts.header.token = token
            }
        } catch (e) {
            logger.error(e)
        }
        task = wx.request(opts)
        queue.add(task)
    })
}

function get (url = '', data = {}, params = {}) {
  return request(Object.assign({}, params, {
    url,
    data
  }))
}

function post (url = '', data = {}, params = {}) {
  return request(Object.assign({}, params, {
    url,
    data,
    method: 'POST'
  }))
}

module.exports = {
  request,
  requestPost,
  get,
  post,
  loopRequest
}
