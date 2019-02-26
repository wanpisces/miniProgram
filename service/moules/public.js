import { request } from './../request.js'
import API from './../api.js'
export const PublicRequest = {
  // 通过code登录
  loginByCode(data = {}) {
    return request(API.loginByCode, 'POST', data)
  }
}