const config = require('../config')
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

 // @param  {String | Object} params={} Modal参数
 function showModal(params = {}) {
  if (typeof params === 'string') {
    params = {
      content: params
    }
  }
  return wx.showModal(Object.assign({
    title: '提示',
    showCancel: false,
    confirmText: '我知道了',
    confirmColor: config.baseColor
  }, params))
}

module.exports = {
  formatTime: formatTime,
  showModal
}
