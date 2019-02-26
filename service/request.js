import qiniuUploader  from './../config/plugins/qiniuUploader.js'


/**
 * 小程序请求封装 参数说明
 * @methods:请求方式；
 * @url:请求接口地址
 * @params:请求参数
 */
export function request(url = "", methods = "GET", params = {}) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: url,
      data: params,
      header: {
        'Content-Type': 'application/json',
        'platform': 'miniProgram'
      },
      method: methods,
      success: function(res) {
        wx.hideNavigationBarLoading()
        if (res.statusCode == 200) {
          resolve(res.data)
        } else {
          reject(res.data)
        }
      },
      fail: function(res) {
        reject(res)
        wx.hideNavigationBarLoading()

      },
      complete: function(res) {
        if (res.statusCode) {
          _status(res)
        }
      },

    })
  })

}

function _status(res) {
  switch (res.statusCode) {
    case 500:
      wx.showModal({
        title: '提示',
        content: '服务器错误,点击确定重新获取数据',
        showCancel: true,
        success: function(res) {
          if (res.confirm) {
            request(url, methods, params = {})
          } else if (res.cancel) {}
        }
      })
      break;
    case 403:
      wx.showToast({
        title: 'TOKEN过期',
        icon: 'none'
      })
      break;
    case 404:
      wx.showToast({
        title: '请求地址不存在',
        icon: 'none'
      })
      break;
    case 200:
      // getApp().getRefreshToken(function (token) {
      //   params.token = token
      //   request(url = "", methods = "GET", params = {})
      // })
      if (res.data.code == 4010 || res.data.code == 4003) {
        getApp().getRefreshToken(function (token) {
          params.token = token
          request(url = "", methods = "GET", params = {})
        })
      }
      break;
    case 400:
      break;
    case 504:
      wx.showToast({
        title: '请求超时',
        icon: 'none'
      })
      break;
    default:
      // Message('请求超时');
      break;
  }
}

/**
 * 文件上传
 * @url 接口路径
 * @fileURl 文件路径
 * @success 回调函数
 */
export function uploadMyFile(url, fileUrl, success) {
  var app = getApp()
  wx.uploadFile({
    url: url,
    filePath: fileUrl,
    name: 'file',
    header: {
      'content-type': 'application/json'
    },
    formData: {
      version: my_configure.VERSION,
      group_type: app.data.group_type
    },
    success: function(res) {
      console.log(res)

      try {
        success(JSON.parse(res.data))
      } catch (e) {
        success(e)
      }

      //do something
    },
    fail: function(e) {
      console.log(e)
      wx.hideLoading()
      // toolutils.showFailToast('图片上传失败')
    }
  })

}
/**
 * 七牛云上传
 * @file_ext 文件后缀类型
 * @filePath 文件路径
 * @_success 成功回调
 * @_fail  失败回调
 * @_progress 上传进程回调
 */
export function uploadFileQiniu(file_ext, filePath, _success, _fail, _progress) {
  var params = {}
  params.version = my_configure.VERSION
  params.file_ext = file_ext
  wx.request({
    url: 'https://api.sqydt.darongshutech.com/public/getUploadToken',
    data: params,
    header: {
      'Content-Type': 'application/json',
      'platform': 'miniProgram'
    },
    method: 'GET',
    success: function(qiniuInfo) {

      qiniuUploader.upload(filePath, (res) => {
        res.base_url = my_configure.File_BASE_URL
        _success(res)
      }, (error) => {
        _fail(error)
      }, {
        region: 'ECN',
        key: qiniuInfo.data.data.key, // [非必须]自定义文件 key。如果不设置，默认为使用微信小程序 API 的临时文件名
        // 以下方法三选一即可，优先级为：uptoken > uptokenURL > uptokenFunc
        uptoken: qiniuInfo.data.data.token, // 由其他程序生成七牛 uptoken
      }, (res) => {
        _progress(res)
        console.log('上传进度', res.progress)
        console.log('已经上传的数据长度', res.totalBytesSent)
        console.log('预期需要上传的数据总长度', res.totalBytesExpectedToSend)
      });
    },
    fail: function(e) {
      console.log(e)
    },
    complete: function(c) {
      console.log(c)
    }

  })
}