const app = getApp();
const backgroundAudioManager = wx.getBackgroundAudioManager()

let { _getUserInfo }= require('../../utils/request')
Page({
  data: {
    isLoading:false,
    currentTime:0,
    duration:0,
    durationText:"",
    currentTimeText:"00:00",
    lineWidth:0,
    offsetLeft:'0',
    lineLeft:0,
    static: app.globalData.staticUrl,
    baseUrl:app.globalData.baseUrl,
    audioSrc:'',
    chapter:[],
    isPause:'play',
    currentChapter:0,
    image_input:'',
    audioName:'',
    lessonDetail:{},
    isFinish:false,
    system:'',
    selectId:''
  },

  initAudio(){
    //必须设置title,否则无法播放
    backgroundAudioManager.title = '此时此刻'
    //backgroundAudioManager.epname = '此时此刻'
    //backgroundAudioManager.singer = '许巍'
    //backgroundAudioManager.src="https://csod-sign.qingting.fm/m4a/5facfd2ea64f63ffc74740a5_17989739_24.m4a?sign=672a26a9cbf244a53b52c2a1314b91d9&t=5fca53eb";
    backgroundAudioManager.src=this.data.audioSrc
    
    backgroundAudioManager.onCanplay(()=>{
      if(backgroundAudioManager.duration){
        setTimeout(()=>{
          let duration = backgroundAudioManager.duration
          this.setData({
            duration: Math.round(duration)
          })
          let res = app.dateFormat(Math.round(duration))
          if(res.hour == "00"){
            var durationText = res.minutes + ':' + res.secons
          }else{
            durationText = res.hour + ':' + res.minutes + ':' + res.secons
          }
          this.setData({
            durationText:durationText
          })

        },500)
        
      }
    })
    backgroundAudioManager.onPlay(()=>{
      if(backgroundAudioManager.duration){
        
        setTimeout(()=>{
          let duration = backgroundAudioManager.duration
          this.setData({
            duration: Math.round(duration),
          })
          let res = app.dateFormat(Math.round(duration))
          if(res.hour == "00"){
            var durationText = res.minutes + ':' + res.secons
          }else{
            durationText = res.hour + ':' + res.minutes + ':' + res.secons
          }
          this.setData({
            durationText:durationText
          })
        },500)
      }
    })
    
    backgroundAudioManager.onTimeUpdate(this.onTimeUpdateCall)
    backgroundAudioManager.onEnded(()=>{
      this.setData({
        isPause:'pause',
        offsetLeft:this.data.lineWidth - 7,
        isFinish:true
      })
    })
    backgroundAudioManager.onSeeked(()=>{
      //onSeeked方法开发工具上不支持，手机上正常执行。
      let duration = this.data.duration
      let currenttime = backgroundAudioManager.currentTime
      let offsetLeft = currenttime/duration*(this.data.lineWidth-7)
      this.calculateLeft(offsetLeft)
      this.audioPlay()
      this.setData({
        isPause:'play'
      })
    })
  },
  audioPlay(){
    backgroundAudioManager.play()
  },

  audioPause(){
    backgroundAudioManager.pause()
  },

  pauseSing(e){
    let pause = e.currentTarget.dataset.pause
    this.setData({
      isPause:pause
    })
    if(pause=='pause'){
      backgroundAudioManager.pause()
    }else{
      //andriod可以直接调用播放play,ios播放中可以直接调用。播放完成后无法调用play()
      let flag = /ios/i.test(this.data.system)
      if(this.data.isFinish&&flag){
        
         this.initAudio()
      }else{
        this.audioPlay()
      }
      
    }
  },

  onTimeUpdateCall(){
      let currenttime = backgroundAudioManager.currentTime
      let duration = backgroundAudioManager.duration
      //只有当duration获取到之后，才能设置进度条的进度。
      if(duration){
        //原来数据被重置，需要重新设置时间。
        if(!this.data.durationText){
          this.setData({
            durationText:"00:00"
          })
        }
        let offsetLeft = currenttime/duration*(this.data.lineWidth-7)
        this.calculateLeft(offsetLeft)
      }else{
        //andriod手机获取duration
        this.audioPause()
        setTimeout(() => {
          this.audioPlay()
        }, 0);
      }
      
      if(duration){//解决iphone 手机音频播放完成时，当前时间显示0。

        let res = app.dateFormat(Math.round(currenttime))
        if(res.hour == "00"){
          var currenttimeText = res.minutes + ':' + res.secons
        }else{
          currenttimeText = res.hour + ':' + res.minutes + ':' + res.secons
        }
        this.setData({
          currentTimeText:currenttimeText
        })

      }

      
      
  },

  getElementInfo(){
    const query = this.createSelectorQuery();
    const that = this;
    const lineEle = query.select('.line').boundingClientRect();
    lineEle.exec((res)=>{
      this.maxLeft = res[0].width-7;
      this.startX = res[0].left;
      that.setData({
        lineWidth:res[0].width,
        lineLeft:res[0].left
      })
    })
  },

  touchProgressStart(e){
     
  },

  touchProgressMove(e){
    let offsetLeft = e.changedTouches[0].pageX - this.startX;
    this.calculateLeft(offsetLeft);

    backgroundAudioManager.pause();
    this.setData({
      isPause:'pause'
    })
  },

  touchProgressEnd(e){
    //手势操作，不要计算进度点的位置，进度点的移动完全交给音频控件，否则容易造成冲突。进度点跳动。
    let offsetLeft = e.changedTouches[0].pageX - this.startX
    //边界检测。防止进度条超出滑动范围。
    let maxLeft = this.maxLeft
    if(offsetLeft < 0 ){
      offsetLeft = 0
    }
    if(offsetLeft > maxLeft){
      offsetLeft = maxLeft
    }
    let newposition = this.data.duration*offsetLeft/(this.data.lineWidth-7)
    backgroundAudioManager.seek(newposition) 
  },

  calculateLeft(offsetLeft){
    let maxLeft = this.maxLeft
    if(offsetLeft < 0 ){
      offsetLeft = 0
    }
    if(offsetLeft > maxLeft){
      offsetLeft = maxLeft
    }
    this.setData({
      offsetLeft: offsetLeft
    })
    return offsetLeft
  },
  selectChapter(e){
    let audiosrc = e.currentTarget.dataset.audiosrc
    let audioname = e.currentTarget.dataset.audioname
    let index = e.currentTarget.dataset.chapterindex
    let chapterid = e.currentTarget.dataset.chapterid
    this.setData({
      audioSrc: audiosrc,
      currentTime :0,
      currentTimeText:"00:00",
      isPause:'play',
      currentChapter:index,
      audioName:audioname,
      selectId:chapterid
    })
    this.initAudio()
    this.calculateLeft(0)
    
  },
  nextChapter(){
    let index = this.data.currentChapter
    let audiosrc = ''
    let audioName = this.data.audioName
    let audioId = ''
    if(index < this.data.chapter.length-1){
      index += 1
      audiosrc = this.data.chapter[index].audio_url
      audioName = this.data.chapter[index].name
      audioId = this.data.chapter[index].id
    }else{
      return false
    }
    
    this.setData({
      audioSrc: audiosrc,
      currentTime :0,
      currentTimeText:"00:00",
      isPause:'play',
      currentChapter:index,
      audioName,
      selectId:audioId
    })
    //backgroundAudioManager.stop()
    this.initAudio()
    this.calculateLeft(0)
  },
  prevChapter(){
    let index = this.data.currentChapter
    let audiosrc = ''
    let audioName = this.data.audioName
    let audioId = ''
    if(index > 0){
      index -= 1
      audiosrc = this.data.chapter[index].audio_url
      audioName = this.data.chapter[index].name
      audioId = this.data.chapter[index].id
    }else{
      return false
    }
    // backgroundAudioManager.stop()
    this.setData({
      audioSrc: audiosrc,
      currentTime :0,
      currentTimeText:"00:00",
      isPause:'play',
      currentChapter:index,
      audioName,
      selectId:audioId
    })
    this.initAudio()
    this.calculateLeft(0)
  },
  goText(){

    wx.redirectTo({
      url: '../lesson-read/lesson-read?id='+this.data.id
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
          lessonDetail:data,
          chapter:data.chapter,
          audioSrc:data.chapter[0].audio_url,//试看
          image_input:data.image_input,
          audioName:data.chapter[0].name,
          selectId:data.chapter[0].id
        })
        that.initAudio()
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

  onLoad: function (option) {
    let that = this
    this.getElementInfo();
    this.setData({
      id:option.id
    })

    wx.getSystemInfo({
      success (res) {
        
        that.setData({
          system:res.system
        })
      }
    })

    this.silenceAuth()
  },
  onReady: function () {
    console.log("onready")
    
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log("onShow")
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    // backgroundAudioManager.stop()
    // backgroundAudioManager.destroy()
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    // backgroundAudioManager.stop()
    // backgroundAudioManager.destroy()
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
