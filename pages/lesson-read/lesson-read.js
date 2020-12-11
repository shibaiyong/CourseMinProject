const app = getApp();

let { _getUserInfo }= require('../../utils/request')
Page({
  data: {
    isLoading:false,
    id:'',
    static: app.globalData.staticUrl,
    baseUrl:app.globalData.baseUrl,
    currentChapter:0,
    chapterName:'',
    chapter:[],
    lessonDetail:{}
  },

  goAudio(){

    wx.redirectTo({
      url: '../lesson-listen/lesson-listen?id='+this.data.id
    })

  },
  goVedio(){

    wx.navigateTo({
      url: '../lesson-detail/lesson-detail?id='+this.data.id
    })

  },

  getdetailLesson(id) {
    //获取课程详情
    const that = this;
    wx.request({
      url: that.data.baseUrl + "lesson/detail/" + id,
      data: {},
      header: {
        Authorization: "Bearer " + app.globalData.token,
      },
      success: (res) => {
        if(res.data.status !=200){
          wx.showToast({
            icon:'none',
            title: res.data.msg,
          })
        }
        that.setData({
          isLoading:false
        })
        let data = res.data.data;
        //   "is_buy": 0,//是否已购买 0未登录或者未购买1已下单未支付2已支付
        if(!app.globalData.token){//未登录

        }else if(data.is_buy==0){//未购买

        }else if(data.is_buy==1){//已下单未支付

        }else if(data.is_buy==2){//已支付
            
        }
        that.setData({
          chapter:data.chapter,
          chapterName:data.chapter[0].name,
          chapterContent:data.chapter[0].text,
          lessonDetail:data
        });
      },
    });
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
                wx.setStorage({
                  data: res.data.data.token,
                  key: "token",
                });
                that.getdetailLesson(that.data.id);
                _getUserInfo();
              } else {
                that.getdetailLesson(that.data.id);
                if (res.data.status == 414) {//已授权基础信息  待授权手机号的走这里
                  //授权成功，请绑定手机号
                }
              }
            },
          });
        },
        fail(err){
          console.log(err)
        }
      });
  },

  nextChapter(){
    let index = this.data.currentChapter
    let chapterName = ''
    let chapterContent = ''
    if(index < this.data.chapter.length-1){
      index += 1
      chapterName = this.data.chapter[index].name
      chapterContent = this.data.chapter[index].text
    }else{
      return false
    }
    
    this.setData({
      currentChapter:index,
      chapterName,
      chapterContent
    })
   
  },
  prevChapter(){
    let index = this.data.currentChapter
    let chapterName = ''
    let chapterContent = ''
    if(index > 0){
      index -= 1
      chapterName = this.data.chapter[index].name,
      chapterContent = this.data.chapter[index].text
    }else{
      return false
    }

    this.setData({
      currentChapter:index,
      chapterName,
      chapterContent
    })
  },

  

  onLoad: function (option) {
    this.setData({
      id:option.id
    })
    this.silenceAuth()
  },
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
    this.audioContext.stop()
    this.audioContext.destroy()
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    this.audioContext.stop()
    this.audioContext.destroy()
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},
});
