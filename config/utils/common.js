//过滤字符
export function stripscript(str, regexp) {
  var pattern = new RegExp(regexp)
  var rs = "";
  for (var i = 0; i < str.length; i++) {
    rs = rs + str.substr(i, 1).replace(pattern, '');
  }
  return rs;
}

//授权获取用户地理位置
export function getLocation(success, fail) {
  // fail(e)
  return new Promise((resolve, reject) => {
    wx.getLocation({
      type: 'gcj02',
      success: function(res) {
        // success(res)
        getApp().data.refreshLocation = false
        resolve(res)
      },
      fail: function(e) {
        console.log('getLocation', e)
       
        if (e.errCode == -2) {
          myShowToast('请去手机设置打开微信位置授权')
          return
        }
        wx.showModal({
          title: '温馨提示',
          content: '请在我的-设置中，授权使用我的地理位置！',
          success: function(res) {
            if (res.confirm) {
              wx.navigateTo({
                url: '/pages/publicSP/pages/locationSetting/locationSetting'
              })
            } else if (res.cancel) {
              reject({ code: 0, masseage: '获取失败' })
            }
          }
        })
      }
    })
  })

}




/**
 * canvas的文字处理
 * deail:需要处理的文本
 * length:一行文本的长度，中文长度为2，英文长度为1
 * row：行数
 */
export function canvasTxtHandle(detail, length, row) {
  let len = 0;
  let index = 0
  let content = []
  detail = detail || ''

  for (let i = 0; i < detail.length; i++) {
    // 若未定义则致为 ''
    if (!content[index]) content[index] = ''
    content[index] += detail[i]
    // 中文或者数字占两个长度
    if (detail.charCodeAt(i) > 127) {
      len += 2;
    } else {
      len++;
    }

    if (len >= length || (row - index == 1 && len >= length - 2)) {
      len = 0
      index++
    }
    if (index === row) {
      if (content[index - 1].length == detail.length) {
        break
      }
      content[index - 1] += '...'
      break
    }
  }
  return content
}

/**
 * 获取字符串的实际长度
 */
export function getStrLength(str) {
  return str.replace(/[\u0391-\uFFE5]/g, "aa").length;
}