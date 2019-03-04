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
    development: 'https://dev-shiyanshi.ecojing.com',
    production: ''
}



const config = {
    appid: 'wxc497f8ebc087c7e7', //测试
    env,
    version,
    host: hosts[env],
    pageSize: 10,
    baseColor: '#ff6a74',
    storage: {
        sessionKey: 'token',
        userKey: 'user'
    }
}
module.exports = config