const network = require("./network.js")
const promisify = require("./promisify.js")
const upload = promisify(network.upload)
const api = require('./api')

function uploadMultiImage(paths,callback,type){
        //let z = this
        let url='';
        if(type == 1){//type 1图片 2视频
             url = api.uploadMedia.uploadImg;
        }else if(type == 2){
            url =api.uploadMedia.uploadVideos;
        }
        const promises = paths.map(function (path) {
            return upload({
                url: url,
                path: path,
                name: 'file',
                extra: {},
            })
        })

        wx.showLoading({
            title: '正在上传...',
        })

        Promise.all(promises).then(function (datas) {
            //所有上传完成后
            wx.hideLoading()
            // 服务器返回的路径
            let paths = datas.map(data => {
                return data.data
                //return data.data.img.outUrl
            })
           callback(paths)
            // 保存，这里可以选择发送一个请求，保存这几条路径
            //images = images.concat(paths)
        }).catch(function (res) {
            wx.hideLoading()
        })
    }

module.exports = {
    uploadMultiImage: uploadMultiImage
}