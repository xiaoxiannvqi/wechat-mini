//app.js
App({
  onLaunch() {
    let that = this
    wx.getSystemInfo({
      success(res) {
        that.globalData.srcollH = res.windowHeight
      }
    })
  },
  globalData: {
    srcollH:0//设备高度
  }
})