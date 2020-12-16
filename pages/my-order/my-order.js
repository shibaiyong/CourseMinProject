const app = getApp()
let {
  _getUserInfo
} = require('../../utils/request')
Page({
  data: {
    static: app.globalData.staticUrl,
    baseUrl: app.globalData.baseUrl,
    lesson_live_on:0,
    time: [{
        countDownDay: '00'
      },
      {
        'countDownHour': '00'
      },
      {
        'countDownHour': '00'
      },
      {
        'countDownMinute': '00'
      },
      {
        'countDownSecond': '00'
      }
    ],
    list: [],
    isLogin: false, //未登录
    ishow: false,
    page: 1,
    limit: 10,
    over: false,
    isLoading: true,
    type: 2
  },
  cancelOrder(e) {
    let that = this
    let {
      id
    } = e.currentTarget.dataset
    wx.showModal({
      title: '提示',
      content: '确定要取消支付该订单吗？',
      success (res) {
        if (res.confirm) {
          wx.request({
            url: that.data.baseUrl + "lesson/order/cancel",
            data: {
              id,
            },
            header: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + app.globalData.token,
            },
            success: (res) => {
              let data = res.data;
            //  console.log('您已取消支付', res)
              
            that.setData({
              list:[],
              over: false
            })
            console.log('that.data.type____',that.data.type,that.data.limit)
            that.getOrderList({
              type: that.data.type,
              page: 1,
              limit: that.data.limit,
            })
              if (res.data.status == 200) {
                wx.showToast({
                  icon: "none",
                  title: '您已取消支付',
                })
              } else {
                wx.showToast({
                  icon: "none",
                  title: res.data.msg,
                })
              }
             
      
            },
          });      
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
   
    
  },
  payOrder(e) {
    let {
      id
    } = e.currentTarget.dataset
    let that = this
    wx.request({
      url: that.data.baseUrl + "lesson/order/buy",
      data: {
        lesson_id: id,
      },
      header: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + app.globalData.token,
      },
      success: (res) => {
        let data = res.data;

        if (data.status == 200 && !data.data.appId) { //不需要支付的订单

          wx.showToast({
            title: '购买成功',
            icon: 'none'
          })
          that.getOrderList({
            type: that.data.type,
            page: 1,
            limit: that.data.limit,
          })
        } else {
          let info = {}
          info = data.data
          console.log('订单————————', info)
          wx.requestPayment({
            timeStamp: info.timestamp,
            nonceStr: info.nonceStr,
            package: info.package,
            signType: info.signType,
            paySign: info.paySign,
            success(res) {
              // wx.showToast({
              //   title: '购买成功',
              //   icon: 'none'
              // }) 
              wx.reLaunch({
                url: '../pay-result/pay-result?id='+data.data.order_id+'&list=1',
              })
              that.getOrderList({
                type: that.data.type,
                page: 1,
                limit: that.data.limit,
              })
            },
            fail(res) {
              wx.showToast({
                icon: "none",
                title: '您已取消支付',
              })
            }
          })
        }

      },
    });
  },
  goJoinUp(e){

    const { id, lessonid } = e.currentTarget.dataset
    wx.navigateTo({
      url: '../join-up/join-up?id=' + id + '&edu_id=' + lessonid + '&type=' + this.data.type,
    })

  },
  detialOrder(e) {
    let {
      id
    } = e.currentTarget.dataset
    wx.navigateTo({
      url: '../order-detail/order-detail?id=' + id,
    })
    console.log(id)
  },
  silenceAuth() { //静默登录
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
              console.log('olduser')
              //老用户
              app.globalData.token = res.data.data.token;
              that.setData({
                isLogin: true
              })
              wx.setStorage({
                data: res.data.data.token,
                key: "token",
              });
              that.getUserInfo();
            } else {
              that.setData({
                ishow: true
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
  getinfoBack(e) { // authorize phone
    const that = this
    that.setData({
      isLogin: true
    })
    that.getUserInfo();
  },
  getUserInfo() {
    let that = this;
    wx.request({
      url: app.globalData.baseUrl + "user",
      data: {},
      header: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + app.globalData.token,
      },
      success: (res) => {
        let {
          msg,
          data,
          status
        } = res.data;
        if (status != 200) {
          wx.showToast({
            title: msg,
            icon: "none",
          });
          return false;
        }
        app.globalData.userinfo = data;
        that.getOrderList({
          type: that.data.type,
          page: 1,
          limit: that.data.limit,
        })
        that.setData({
          userinfo: data
        })
        wx.setStorage({
          data: data,
          key: "userinfo",
        });
      },
    });
  },
  onLoad: function (options) {
    // const that = this
    // that.setData({
    //   lesson_live_on:app.globalData.lesson_live_on
    // })
    // that.silenceAuth()

  },
  changeTab(e) {
    const that = this
    let {
      id
    } = e.currentTarget.dataset
    this.setData({
      list: [],
      type: id,
      over: false
    })
    that.getOrderList({
      type: id,
      page: 1,
      limit: that.data.limit
    })

  },
  getOrderList(obj) {
    const that = this;
    let page = that.data.page
    if (that.data.over) {
      console.log('数据加载完毕')
      return false
    }
    wx.request({
      url: that.data.baseUrl + "lesson/order/list",
      data: obj,
      header: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + app.globalData.token,
      },
      success: (res) => {
        console.log('order-list___', res.data.data)
        let data = res.data.data.list
        let list = that.data.list.concat(data)
        if (list.length < res.data.data.count) {
          page = page + 1
          that.setData({
            page
          })
        } else {
          that.setData({
            over: true
          })
        }
        let time = []
        that.setData({
          time:[]
        })
        for(let i=0;i<1000;i++){
          clearInterval(i);
        }
        //---------------



        //----------------
        list.forEach(item => {
          time.push({
            pay_end_time: item.pay_end_time
          })
          let start_time = item.start_time
          let end_time = item.end_time
          if (start_time) {
            item.start_time = start_time.replace(/\-/g, ".").replace(/\-/g, ".").split(' ')[0]
          }
          if (end_time) {
            item.end_time = end_time.replace(/\-/g, ".").replace(/\-/g, ".").split(' ')[0] 
          }
        })
        that.setData({
          isLoading: false,
          list
        })
        //---------------------
        time.forEach(item => {
          //活动倒计时
          let currentTime = Date.parse(new Date()) / 1000;
          if (currentTime < item.pay_end_time) {
            // 秒数
            let second = item.pay_end_time - currentTime;
           let interval= setInterval(() => {
              // 天数位
              let day = Math.floor(second / 3600 / 24);
              let dayStr = day.toString();
              if (dayStr.length == 1) dayStr = '0' + dayStr;

              // 小时位
              let hr = Math.floor((second - day * 3600 * 24) / 3600);
              let hrStr = hr.toString();
              if (hrStr.length == 1) hrStr = '0' + hrStr;

              // 分钟位
              let min = Math.floor((second - day * 3600 * 24 - hr * 3600) / 60);
              let minStr = min.toString();
              if (minStr.length == 1) minStr = '0' + minStr;

              // 秒位
              let sec = second - day * 3600 * 24 - hr * 3600 - min * 60;
              let secStr = sec.toString();
              if (secStr.length == 1) secStr = '0' + secStr;


              item.countDownDay = dayStr
              item.countDownHour = hrStr
              item.countDownMinute = minStr
              item.countDownSecond = secStr

              second--;
              if (second < 0) {
              clearInterval(interval);
              wx.showToast({
                title: '订单已到期',
              });
              this.setData({
                countDownDay: '00',
                countDownHour: '00',
                countDownMinute: '00',
                countDownSecond: '00',
              });
              }
              that.setData({
                    time
                  })
            }, 1000)




          }


        })
        // setInterval(()=>{

        // },1000)
      },
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
    const that = this
    that.setData({
      lesson_live_on:app.globalData.lesson_live_on
    })
    that.silenceAuth()
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
    const that = this
    let {
      page,
      type,
      limit
    } = this.data
    that.getOrderList({
      type,
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