const app = getApp();

/*静默登录*/
const _silenceAuth=()=>{
  
  
}

const _onLive=()=>{
  let that =this
  wx.request({
    url: app.globalData.baseUrl + "lesson/config",
    data: {},
    header: {
      "Content-Type": "application/json",
    },
  success: (res) => {
      app.globalData.lesson_live_on = res.data.data.lesson_live_on

      app.globalData.service_phone = res.data.data.service_phone
      
    },
  });
}

const _getUserInfo=() =>{
  //用户基础信息和手机号都已授权后  调用此接口获取数据库里存储的用户信息
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
      wx.setStorage({
        data: data,
        key: "userinfo",
      });
    },
  });
}

module.exports = {
  _silenceAuth,
  _getUserInfo,
  _onLive
}