
/** es7 编译 */
import regeneratorRuntime from './../../../config/plugins/runtime.js'
/** 请求数据 */
import { HomeRequest } from './../../../service/moules/home.js'

import { getLocation } from './../../../config/utils/common.js'
let that;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    search: {
      run_in: 1,
      current_page: 1,
      page_size: 20,
      group_id: 1,
      category_id: 1000
    }
  },
  async  getData() {
    const res = await HomeRequest.newsList(this.data.search)
    console.log(res)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    this.getData();
    let text = '长精神的的空间的分!类分类打发打ccc是zzzz是是发dsdsds'
    // console.log(canvasTxtHandle(text, 8, 3))
    // console.log(canvasText(text))
    getLocation().then(res => {
      console.log(res)
    }).catch(e => {
      console.log(e, 'aaaaaaaaaa')
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (getApp().data.refreshLocation == true) {
      getLocation().then(res => {
        console.log(res)
      }).catch(e => {
        console.log(e, 'aaaaaaaaaa')
      });
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})