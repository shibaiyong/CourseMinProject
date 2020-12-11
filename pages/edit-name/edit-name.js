const app = getApp()
Page({
  data: {
    static: app.globalData.staticUrl,
    nickname:'',
    userinfo:{}
  },
  onLoad: function (options) {

  },
  del(e){
    let that = this
    console.log('_______AA',)
    console.log('userinfo.nickname___',that.data.nickname)
    that.setData({
      nickname:''
    })
  },
  blurName(e){
    const that=this
    // userinfo.uid
    if(e.detail.value==''){
      wx.showToast({
        title: '昵称不能为空',
        icon:'none'
      })
       return false
    }else if(that.data.userinfo.nickname==e.detail.value){
      // wx.showToast({
      //   title: '',
      //   icon:'none'
      // })
      return false
    }
    wx.request({
      url: app.globalData.baseUrl + "user/edit",
      data: {
        nickname:e.detail.value,
        avatar:that.data.userinfo.avatar
      },
      method:'POST',
      header: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + app.globalData.token,
      },
      success: (res) => {
        console.log('eeeee',res.data)
        if(res.data.status==200){
          wx.showToast({
            title: res.data.msg
          })
          wx.navigateBack({
            delta: 0,
          })
        }else{
          wx.showToast({
            title: res.data.msg,
            icon:'none'
          })
        }
      },
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      console.log('app.globalData.userinfo___',app.globalData.userinfo)
      this.setData({
        nickname:app.globalData.userinfo.nickname,
        userinfo:app.globalData.userinfo
      })
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