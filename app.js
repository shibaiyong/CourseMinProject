//const ald = require('./utils/ald-stat.js')
App({
  onLaunch: function () {
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager();
      updateManager.onCheckForUpdate(function (res) {
          if (res.hasUpdate) { // 请求完新版本信息的回调
              updateManager.onUpdateReady(function () {
                  wx.showModal({
                      title: '更新提示',
                      content: '新版本已经准备好，是否重启应用？',
                      success: function (res) {
                          if (res.confirm) {// 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                            updateManager.applyUpdate()
                          }
                      }
                  })
              });
              updateManager.onUpdateFailed(function () {
                  wx.showModal({// 新的版本下载失败
                      title: '已经有新版本了哟~',
                      content: '新版本已经上线啦~，请您删除当前小程序，重新搜索进入哟~',
                  })
              })
          }
      })
  } else {
      wx.showModal({// 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
          title: '提示',
          content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
  }
    const that = this;

    //wx2ea8856aa18cbb3b   生产appid
    //wxf68e33546ab15731   开发
   
  },
  onShow: function(){
    console.log("update___",this)
    let that =this
    wx.getSystemInfo({
        success (res) {
         let sys=res.model
         if(sys.indexOf('iPhone') == -1){
          that.globalData.isAndroid=true
         }
        }
      })
  },
  gameOver(start,end){
    if(!start||!end){
      return false
    }
    var startArr = start.split(/[: -]/)
    var endArr = end.split(/[: -]/)
    var startDate = new Date(startArr[0], startArr[1]-1, startArr[2], startArr[3], startArr[4], startArr[5])
    var endDate = new Date(endArr[0], endArr[1]-1, endArr[2], endArr[3], endArr[4], endArr[5])
    var endTimes = endDate.getTime() - startDate.getTime()
    if(endTimes<=0){
      return {
        othertime:'00天00时'
      }
    }

    var day = parseInt(endTimes/3600/1000/24);
    var hour = parseInt(endTimes/1000/3600%24);
    // var minutes = parseInt((endTimes/1000/60%60));
    // var secons = parseInt((endTimes/1000%60));
    
    var hour = hour < 10 ? "0"+hour : hour;
    // var minutes = minutes < 10 ? "0"+minutes : minutes;
    // var secons = secons < 10 ? "0"+secons : secons;
    return {
      othertime:day+'天'+hour+'时'
    }
  },
  dateFormat(times){
    //单位s
    if(!times && times < 0){
      return false
    }

    var day = parseInt(times/3600/24);
    var hour = parseInt(times/3600%24);
    var minutes = parseInt((times/60%60));
    var secons = parseInt((times%60));
    
    var day = day < 10 ? "0"+day : day;
    var hour = hour < 10 ? "0"+hour : hour;
    var minutes = minutes < 10 ? "0"+minutes : minutes;
    var secons = secons < 10 ? "0"+secons : secons;
    return { day, hour, minutes, secons }
  },
  globalData: {
    isAndroid:false,
    userInfo: null,
    token: "",
    isLogin: false,
    // baseUrl: "https://test.vvip333.com/api/",
    // staticUrl2:'https://test.vvip333.com/static/img',
    baseUrl:"https://ywkt.yeoner.com/api/",
    staticUrl2:"https://ywkt.yeoner.com/static/img",
    staticUrl: "../../images",
    lesson_live_on:0,//0关闭直播 1打开直播 
    service_phone:""
  },
});
