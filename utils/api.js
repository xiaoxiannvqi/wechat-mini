/**
 * @desc Api
 * @author sunqi
 * @company fivefire
 * @date 14 Nov 2017
 */

'use strict'

const config = require('../config')
const req = require('./request')
const util = require('./util')
const prefix = config.host //ceshi
const requestParam = require('./requestParam')
const wrap = (url, type = 'GET',loading=true) => (config = {}) => req.request(Object.assign({loading:loading}, config, {
  method: type,
  url: prefix + url
}))
const wrappost = (url, type = 'GET') => (config = {}) => req.requestPost(Object.assign({}, config, {
  method: type, 
  url: prefix + url
}))
const wraposs = (url, type = 'GET') => (config = {}) => req.request(Object.assign({}, config, {
  method: type,
  url: prefixoss + url,
  complete: true
}))
const wraplooposs = (url, type = 'GET') => (config = {}) => req.loopRequest(Object.assign({}, config, {
  method: type,
  url: prefixoss + url,
  complete: true
}))
const wrapaliyun = (url, type = 'GET') => (config = {}) => req.request(Object.assign({}, config, {
  method: type,
  url: url
}))
const wraptool = (url, type = 'GET') => (config = {}) => req.request(Object.assign({}, config, {
  method: type,
  url: url
}))

const api = {
  banner: {
    bannerList: wrap('/shop/home/get_banner_list'),
  },
  
}

module.exports = api

