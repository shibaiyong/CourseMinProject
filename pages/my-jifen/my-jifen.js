const app = getApp()
Page({
  data: {
    static: app.globalData.staticUrl,
    static2: app.globalData.staticUrl2,
    baseUrl: app.globalData.baseUrl,
    integral:0,
    // integralList: [],
    list:[],
    isActive: -1,
    page: 1,
    limit: 10,
    over:false,
    pm: -1,
    isLoading: false,
    ishow:true
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
          integral:data.integral
        })
        
        let {page,limit}=that.data
        that.getIntegralList({
          page,
          limit,
          pm: -1 //-1 收支   0  支出   1 收入
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
  /**
   * 获取积分明细
   */
  getIntegralList: function (obj) {
    const that =this
    let page =that.data.page
    if(that.data.over){
      console.log('数据加载完毕')
      return false
    }
    wx.request({
      url: app.globalData.baseUrl + "integral/list",
      data: obj,
      header: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + app.globalData.token,
      },
      success: (res) => {
        let data =res.data.data
        let list =that.data.list.concat(data)
        if(list.length<res.data.data.count){
          page =page+1
          that.setData({
            page,
            list
          })
        }else{
          that.setData({
            over:true
          })
        }
        that.setData({
          isLoading:false,
          list
        })
        // if (status != 200) {
        //   wx.showToast({
        //     title: msg,
        //     icon: "none",
        //   });
        //   return false;
        // }

      },
    });
  },
  tapjf(e) {
    const that = this
    let {
      page,
      limit
    } = this.data
    let {
      id
    } = e.currentTarget.dataset
    this.setData({
      isActive: id,
      list:[],
      over:false,
    })
    id=id/1
    switch (id) {
      case -1:
        that.getIntegralList({
          page,
          limit,
          pm: -1 //-1 收支   0  支出   1 收入
        })
        break;
      case 1:
        that.setData({
          pm: 1
        })
        that.getIntegralList({
          page,
          limit,
          pm: 1 //1 收入
        })
        break;
      case 0:
        that.setData({
          pm: 0
        })
        that.getIntegralList({
          page,
          limit,
          pm: 0 //0  支出 
        })
        break;

      default:
        break;
    }
  },
  // nav: function (current) {
  //   this.current = current;
  // },
  onLoad: function (options) {
    

    this.silenceAuth()
    
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
    const that =this
    let {page,pm,limit}=this.data
    that.getCollectList({
      pm,
      page,
      limit
    })
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