/**
 * @desc 小程序配置文件
 * @author 
 * daxu
 * @company fivefire
 */

// ENV development | production
// 发布的时候需要改一下
//const env = 'development'
const env = 'development'

// APP VERSIION
const version = 1.0

// development and production host
const hosts = {
    development: '',
    production: ''
}



const config = {
    appid: 'wxe033e6ec29346604', //测试
    env,
    version,
    host: hosts[env],
    pageSize: 10,
    storage: {
        sessionKey: 'token',
        userKey: 'user'
    }
}
module.exports = config