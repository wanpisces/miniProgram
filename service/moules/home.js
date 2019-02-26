import { request } from './../request.js'
import API from './../api.js'
export const HomeRequest = {
  /**新闻列表 */
  newsList(data = {}) {
    return request(API.news, 'GET', data)
  }
}