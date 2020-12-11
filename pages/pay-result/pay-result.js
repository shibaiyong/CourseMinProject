const app = getApp()
const _until=require('../../utils/util')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:2,//是否是从我的订单列表进来的  1  是   2  不是
    static: app.globalData.staticUrl,
    baseUrl:app.globalData.baseUrl,
    detail:{},
    id:0,
    edu_id:''
  },
  goJoinUp(){
    wx.navigateTo({
      url: '../join-up/join-up?id=' + this.data.id + '&edu_id=' + this.data.edu_id,
    })
  },
  goIndex(){
    let that =this
    if(that.data.list==1){
      wx.redirectTo({
        url: '../my-order/my-order'
      })
    }else{
      // 1课程 2培训 3直播
      if(that.data.detail.type==1){
        wx.redirectTo({
          url: '../lesson-detail/lesson-detail?id='+that.data.detail.lesson_id
        })
      }else if(that.data.detail.type==2){
        wx.redirectTo({
          url: '../edu-detail/edu-detail?id='+that.data.detail.lesson_id
        })
      }else if(that.data.detail.type==3){
        wx.redirectTo({
          url: '../live-detail/live-detail?id='+that.data.detail.lesson_id
        })
      }
    }
    // wx.switchTab({
    //   url: '../index/index', 
    // })
  },
  toOrderDetail(){
    wx.navigateTo({
      url: '../order-detail/order-detail?id='+this.data.id,
    })
  },
  getOrderDetail(id){
    const that =this
    wx.request({
      url: that.data.baseUrl + "/lesson/order/detail/"+id,
      data:{},
      header: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + app.globalData.token,
      },
      success: (res) => {
        let add_time = res.data.data.add_time
        if(res.data.data.pay_time){
          let pay_time=res.data.data.pay_time
          res.data.data.pay_time=_until.formatTime2(pay_time)
        }
        res.data.data.add_time= _until.formatTime2(add_time)
        that.setData({
          detail:res.data.data
          
        })
      },
    });
  },
  onLoad: function (options) {
    let {id,list,edu_id}=options
    this.setData({
      id,
      list,
      edu_id
    })
    this.getOrderDetail(id)
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

  }
})