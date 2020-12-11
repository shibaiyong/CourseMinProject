const app = getApp()
const _until=require('../../utils/util')
Page({

  data: {
    baseUrl:app.globalData.baseUrl,
    isLoading:true,
    data:{},
    content:'',
    id:0
  },
  getContent(id){
    const that =this
   // let id=that.data.id
    wx.request({
      url: that.data.baseUrl + "/article/details/"+id, 
      header: {
        "Content-Type": "application/json"
      },
      success: (res) => {
       that.setData({
        isLoading:false
       })
        if(res.data.status !=200){
          wx.showToast({
            icon:'none',
            title: res.data.msg,
          })
        }
        let {data} =res.data
        that.setData({
          data,
          content:_until.formatRichText(data.content)
        })
      },
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id:options.id
    })
     this.getContent(options.id)
    // this.getContent(4)
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
    let that =this
    return {
        path: 'pages/detail/detail?id='+that.data.id
    }
  }
})