//app.js
import {
  PublicRequest
} from './service/moules/public.js'
App({
  data: {
    group_type: 2,
    userPhone: '',
    token: '',
    userID: '',
    userInfo: {}
  },
  onLaunch: function (options) {
    this.data.sceneCode = (options && options.scene) || -1 //进入场景值
  },
  //获取token
  getToken(_success) {
    let that = this,
      _streetInfo = getApp().data.streetInfo;
    /**
     *通过 wx.login() 获取到用户登录态之后，需要维护登录态。开发者要注意不应该直接把 session_key、openid 等字段作为用户的标识或者 session 的标识，而应该自己派发一个 session 登录态
     *1、前端检测有无session，没有的话wx.login()，获取session_key 。
     *2、通过session_key 调用后台接口，换取session。
     *3、前端缓存session。
     *4、如果前端检测有session，调用wx.checkSession()，判断session_key 有效期，然后请求业务CGI。
     * */
    wx.checkSession({
      success: function (res) {
        that.data.streetInfo = _streetInfo
        if (that.data.token || '') {
          _success(that.data.token)
        } else {
          wx.getStorage({
            key: 'userInfo',
            success: function (res) {
              that.data.userInfo = res.data.data
              that.data.token = res.data.token
              that.data.userID = res.data.data.user_id
              that.data.userPhone = res.data.data.user_phone
              that.data.isUserAuth = res.data.data.user_avatar && res.data.data.user_nickname && true || false
              _success(res.data.token)
            },
            fail: function (e) {
              Login(that, _success)
            }
          })
        }
      },
      fail: function (res) {
        that.data.streetInfo = _streetInfo
        Login(that, _success)
      }
    })

  },
  //刷新token
  getRefreshToken: function (_success) {
    Login(this, _success)
  },
})

//登录
function Login(_this, _success) {
  wx.login({
    success: resCode => {
      // 发送 res.code 到后台换取 openId, sessionKey, unionId
      console.log(resCode.code)
      // return
      PublicRequest.loginByCode({ code: resCode.code }).then(res => {
        console.log(res)
        if (res.code === 2000) {
          try {
            wx.setStorageSync('userInfo', res)
          } catch (e) { }
          _this.data.userInfo = res.data
          _this.data.token = res.token
          _this.data.userID = res.data.user_id
          _this.data.userPhone = res.data.user_phone
          _this.data.isUserAuth = res.data.user_nickname && true || false
          typeof (_success) == 'function' && _success(res.token)
        }else{
          wx.showToast({
            title: res.msg,
            icon: 'none'
          })
        }
      })
    },
    fail: e => {
      console.log('获取code失败')
    }
  })
}