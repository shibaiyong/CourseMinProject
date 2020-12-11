const app = getApp()
let { _getUserInfo }= require('../../utils/request')
Page({
  data: {
    static: app.globalData.staticUrl,
    baseUrl:app.globalData.baseUrl,
    lesson_live_on:0,
    list:[],
    isLogin:false, //未登录
    ishow:false,
    page:1,
    limit:10,
    over:false,
    isLoading:true,
    type:2
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
              if (res.data.msg == "登录成功") {
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
                that.setData({
                  ishow:true
                })
                // if (res.data.status == 414) {//已授权基础信息  待授权手机号的走这里
                // }
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
        that.getCollectList({
          type:that.data.type,
          page:1,
          limit:that.data.limit,
        })
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
  changeTab(e){
    const that =this
   let {id}= e.currentTarget.dataset
   this.setData({
    list:[],
    type:id,
    over:false
   })
  that.getCollectList({
    type:id,
    page:1,
    limit:that.data.limit
  })
   
  },
  getCollectList(obj){
    const that = this;
    let page =that.data.page
    if(that.data.over){
      console.log('数据加载完毕')
      return false
    }
    wx.request({
      url: that.data.baseUrl + "lesson/collect/list",
      data:obj,
      header: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + app.globalData.token,
      },
      success: (res) => {
        let data =res.data.data.list
        let list =that.data.list.concat(data)
        if(list.length<res.data.data.count){
          page =page+1
          that.setData({
            page
          })
        }else{
          that.setData({
            over:true
          })
        }
        list.forEach(item=>{
          let start_time = item.start_time
          let end_time = item.end_time
          if(start_time){
            item.start_time =start_time.replace(/\-/g,".").split(' ')[0]
          }
          if(end_time){
            item.end_time =end_time.replace(/\-/g,".").split(' ')[0]
          }
          
         // list.end_time=list.end_time.replace(/\-/g,".")
        })
        that.setData({
          isLoading:false,
          list
        })
       
      },
    });
  },
  goDetail(e){
    const that = this
    let {id,type}=e.currentTarget.dataset
    type=type/1
    switch (type) {
      case 1:
        wx.navigateTo({
          url: '../lesson-detail/lesson-detail?id='+id,
        })
        break;
        case 2:
          wx.navigateTo({
            url: '../edu-detail/edu-detail?id='+id
          })
        break;
        case 3:
        wx.navigateTo({
          url: '../live-detail/live-detail?id='+id,
        })
        break;
    
      default:
        break;
    }
  },
  cancelLike(e){
    const that = this
    let {id}=e.currentTarget.dataset
    wx.request({
      url: that.data.baseUrl + "lesson/collect",
      data:{
        lesson_id:id
      },
      header: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + app.globalData.token,
      },
      success: (res) => {
        wx.showToast({
          title: res.data.status,
          icon:'none'
        })
        let list = that.data.list
        list = list.filter(item => item.lesson_id != id) 
        that.setData({
          list
        })
       
      },
    });

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.silenceAuth()
    this.setData({
      lesson_live_on:app.globalData.lesson_live_on
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
    const that =this
    let {page,type,limit}=this.data
    that.getCollectList({
      type,
      page,
      limit
    })
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})