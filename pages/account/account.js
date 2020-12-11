const app = getApp()
let { _getUserInfo ,_onLive}= require('../../utils/request')
Page({
  data: {
    static: app.globalData.staticUrl,
    baseUrl:app.globalData.baseUrl,
    lesson_live_on:0,
    service_phone:'',
    isLogin:false, //未登录
    ishow:false,
    userinfo:{},
    isLoading:true
  },
  handleContact(e){

    console.log(e.detail.path)
    console.log(e.detail.query)

  },
  call(e){
    let { phone } = e.currentTarget.dataset;
    wx.makePhoneCall({
      phoneNumber: phone,
    })
  },
  editUser(){
    wx.navigateTo({
      url: '../edit-name/edit-name',
    })
  },
  openAuthorize(e){
    this.setData({
      ishow:true
    })
  },
  silenceAuth(){//静默登录
    const that = this;
      wx.login({
        success(res) {
          wx.request({
            url: that.data.baseUrl + "v2/wechat/silence_auth",
            data: {
              code: res.code,
            },
            success: (res) => {
              that.setData({
                isLoading:false
              })
              if (res.data.msg == "登录成功") {
                console.log('olduser')
                //老用户
                app.globalData.token = res.data.data.token;
                that.setData({
                  isLogin:true
                })
                wx.setStorage({
                  data: res.data.data.token,
                  key: "token",
                });
                that.getUserInfo();
              } else {
                if (res.data.status == 414) {//已授权基础信息  待授权手机号的走这里
                }
              }
            },
          });
        },
      });
  },
  ishowBack(e) {
    let ishow = e.detail.ishow;
    this.setData({
      ishow,
    });
  },
  getinfoBack(e){// authorize phone
    const that =this
    that.setData({
      isLogin:true
    })
    that.getUserInfo(); 
  },
  getUserInfo(){
    let that = this;
    wx.request({
      url: app.globalData.baseUrl + "user",
      data: {},
      header: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + app.globalData.token,
      },
      success: (res) => {
        
        let { msg, data, status } = res.data;
        if (status != 200) {
          wx.showToast({
            title: msg,
            icon: "none",
          });
          return false;
        }
        app.globalData.userinfo = data;
        that.setData({
          userinfo:data
        })
        wx.setStorage({
          data: data,
          key: "userinfo",
        });
      },
    });
  },
  mylesson(){
    wx.navigateTo({
      url: '../my-lesson/my-lesson',
    })
  },
  mylike(){
    wx.navigateTo({
      url: '../my-likes/my-likes',
    })
  },
  us(){
    wx.navigateTo({
      url: '../about-us/about-us',
    })
  },
  gojifen(){
    wx.navigateTo({
      url: '../my-jifen/my-jifen',
    })
  },
  order(){
    wx.navigateTo({
      url: '../my-order/my-order',
    })
  },
  bindGetUserInfo(e) {
    console.log(e.detail.userInfo)
    if (e.detail.userInfo){
      //用户按了允许授权按钮
    } else {
      //用户按了拒绝按钮
    }
  },
  onLoad: function (options) {
    _onLive()
    this.silenceAuth()
    this.setData({
      lesson_live_on:app.globalData.lesson_live_on,
      service_phone : app.globalData.service_phone
    })
    // wx.getSetting({
    //   success: function(res){
    //     if (res.authSetting['scope.userInfo']) {
    //       wx.getUserInfo({
    //         success: function(res) {
    //           console.log(res.userInfo)
    //           //用户已经授权过
    //         }
    //       })
    //     }
    //   }
    // })
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
    let that =this
    if(app.globalData.userinfo){
      that.getUserInfo(); 
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