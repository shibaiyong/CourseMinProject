const { _getUserInfo } = require("../../utils/request");
const app = getApp();
Component({
  properties: {
    ishow: {
      type: Boolean,
      default: false,
    },
  },
  data: {
    token: app.globalData.token,
    baseUrl: app.globalData.baseUrl,
    static: app.globalData.staticUrl,
    isUserInfo: true,
    isUserPhone: true,
  },
  methods: {
    closePage(e) {
      let { ishow } = e.currentTarget.dataset;
      this.triggerEvent("ishowBack", { ishow: false });
    },

    getuserinfo(e) {
      if (e.detail.errMsg == "getUserInfo:fail auth deny") {
        wx.showToast({
          title: "请允许微信授权",
          icon: "none",
          duration: 2000,
        });
        return false;
      }
      this.setData({
        isUserInfo: false,
      });
      console.log(e.detail)
      let { iv, encryptedData, signature, userInfo } = e.detail;
      this.wxLogin(1, {
        iv,
        encryptedData,
      });
    },

    getPhoneNumber(e) {
      let { iv, encryptedData, signature, userInfo } = e.detail;
      this.wxLogin(2, {
        iv,
        encryptedData,
      });
    },
    wxLogin(num, obj) {
      let that = this;
      if (num === 1) {
        wx.login({
          success(res) {
            obj.code = res.code;
            wx.request({
              url: that.data.baseUrl + "v2/wechat/mp_auth", //授权获取微信基础信息
              data: obj,
              success: (res) => {
                if (res.data.status == 414) {
                  //授权成功，请绑定手机号
                  wx.showToast({
                    icon: "none",
                    title: res.data.msg,
                  });
                  that.setData({
                    isUserInfo: false,
                    isUserPhone: true,
                  });
                }
              },
            });
          },
        });
      } else if (num === 2) {
        this.triggerEvent("ishowBack", { ishow: false });
        wx.login({
          success(res) {
            obj.code = res.code;
            wx.request({
              url: that.data.baseUrl + "v2/auth_bindind_phone", //授权获取微信绑定手机号
              data: obj,
              method: "post",
              success: (res) => {
                if (res.data.status == 200) {
                  //登录成功
                  wx.showToast({
                    icon: "none",
                    title: res.data.msg,
                  });
                  that.setData({
                    isUserInfo: false,
                    isUserPhone: false,
                  });
                  //------
                  wx.login({
                    success(res) {
                      wx.request({
                        url: that.data.baseUrl + "v2/wechat/silence_auth", //静默登录
                        data: {
                          code: res.code,
                        },
                        success: (res) => {
                          if (res.data.msg == "登录成功") {
                            //老用户
                            app.globalData.token = res.data.data.token;
                            that.triggerEvent("getinfoBack",{});
                            wx.setStorage({
                              data: res.data.data.token,
                              key: "token",
                            });
                            that.getUserInfo();
                          }
                        },
                      });
                    }
                  })
                  //------
                } else {
                  wx.showToast({
                    icon: "none",
                    title: res.data.msg,
                  });
                }
              },
            });
          },
        });
      }
    },
    getUserInfo() {
      //用户基础信息和手机号都已授权后  调用此接口获取数据库里存储的用户信息
      let that = this;
      wx.request({
        url: that.data.baseUrl + "user",
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
          wx.setStorage({
            data: data,
            key: "userinfo",
          });
        },
      });
    },
  },
  lifetimes: {
    created() {
      console.log("在组件实例刚刚被创建时执行");
    },
    attached() {
      console.log("在组件实例进入页面节点树时执行");
    },
    ready() {
      console.log("在组件在视图层布局完成后执行");

      const that = this;
      wx.login({
        success(res) {
          wx.request({
            url: that.data.baseUrl + "v2/wechat/silence_auth", //静默登录
            data: {
              code: res.code,
            },
            success: (res) => {
              if (res.data.msg == "登录成功") {
                //老用户
                app.globalData.token = res.data.data.token;
                wx.setStorage({
                  data: res.data.data.token,
                  key: "token",
                });
                that.getUserInfo();
              } else {
                if (res.data.status == 414) {
                  //授权成功，请绑定手机号
                  that.setData({
                    isUserInfo: false,
                  });
                }
              }
            },
          });
        },
      });
    },
    moved() {
      console.log("在组件实例被移动到节点树另一个位置时执行");
    },
    detached() {
      console.log("在组件实例被从页面节点树移除时执行");
    },
    error() {
      console.log("每当组件方法抛出错误时执行");
    },
    /*组件所在页面的生命周期 */
    pageLifetimes: {
      show: function () {
        // 页面被展示
        console.log("页面被展示");
      },
      hide: function () {
        // 页面被隐藏
        console.log("页面被隐藏");
      },
      resize: function (size) {
        // 页面尺寸变化
        console.log("页面尺寸变化");
      },
    },
  },
});
