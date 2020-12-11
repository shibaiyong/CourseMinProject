const app = getApp();
const _until = require("../../utils/util");
Page({
  data: {
    static: app.globalData.staticUrl,
    baseUrl: app.globalData.baseUrl,
    content: "",
    contentsub:""
  },
  onLoad: function (options) {
    const that = this;
    wx.request({
      url: that.data.baseUrl + "lesson/about",
      success: (res) => {
        let contentsub = _until.formatRichText(res.data.data.content);
        that.setData({
          content: res.data.data,
          contentsub
        });
      },
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},
});
