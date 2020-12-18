const app = getApp();
let { _getUserInfo }= require('../../utils/request')
Page({
  data: {
    focustrue:false,
    realInput:false,
    moreDiscuss:false,
    isLoading:true,
    height:0,
    per:1,
    showMore:false,
    limit:false,
    desc:77,
    descMul:0,
    descContent:'',
    ishow: 0,//微信授权    0 //关闭  1 /新用户   2 待授权手机号
    id: 0,
    baseUrl: app.globalData.baseUrl,
    static: app.globalData.staticUrl,
    tabId: 0, //0   显示  详情  1  内容
    num: 0, //评论数
    isBuy: false, //是否购买
    isBuy2: false, //是否购买
    over: false, //没有更多评价了
    page: 1,
    curtitle: "",
    comment: [],
    count: 0,
    lessonDetail: {},
    chapter:[],
    isLike:false,
    avatar:'',
    videoSrc:'',
    isAutoplay:false,
    // chapter:[],
    tabflag:'',
    videoContext:null,
    initialTime:0,
    currentTime:0
  },
  goText(){

    if (!this.data.isBuy) {
      wx.showToast({
        icon: "none",
        title: "请先购买"
      })
      return false
    }
    wx.redirectTo({
      url: '../lesson-read/lesson-read?id='+this.data.id
    })

  },
  goListen(){

    if (!this.data.isBuy) {
      wx.showToast({
        icon: "none",
        title: "请先购买"
      })
      return false
    }
    wx.redirectTo({
      url: '../lesson-listen/lesson-listen?id='+this.data.id
    })

  },
  showMore(){
    this.setData({
      showMore:false,
      limit:true
    })
  },
  cancelInput(){
    this.setData({
      realInput:false,
      focustrue:false
    })
  },
  openInput(){
    let that =this
    this.setData({
      realInput:true,
    })
    setTimeout(function(){
      that.setData({
        focustrue:true
      })
    },200)
  },
  blurTextarea(e){
    const that=this
    this.setData({
      realInput:false,
      focustrue:false
    })
    if(e.detail.value==''){
      wx.showToast({
        title: '评论不能为空',
        icon:'none'
      })
    }

    wx.request({
      url: app.globalData.baseUrl + "lesson/reply/add",
      data: {
        comment:e.detail.value,
        lesson_id:that.data.id
      },
      header: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + app.globalData.token,
      },
      success: (res) => {
        if(res.data.status==200){
          wx.showToast({
           // title: res.data.msg,
           title:"评论成功",
            icon:"none"
          })
          // wx.navigateBack({
          //   delta: 0,
          // })
          that.setData({
            usercomment:'',
            comment:[] //
          })
          let { id, page } = that.data;
          that.getCommentList({
            id,
            page:1,
            limit: 4,
          });
        }else{
          wx.showToast({
            title: res.data.msg,
            icon:'none'
          })
        }
      },
    });
   
  },
  share(e){
    
  },
  collect(e){
    const that =this
    let { like } = e.currentTarget.dataset;
    let msg=''
    !like ? msg='已收藏' : msg='已取消收藏'
    wx.request({
      url: that.data.baseUrl + "/lesson/collect",
      data: {
        lesson_id:that.data.lessonDetail.id
      },
      header: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + app.globalData.token,
      },
      success: (res) => {
       if(res.data.status==200){
         !like ? that.setData({isLike:true}) : that.setData({isLike:false})
         wx.showToast({
           title: msg,
           icon:'none'
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
  getinfoBack(e){
    const that =this
    that.getdetailLesson(that.data.id);
  },
  ishowBack(e) {
    let ishow = e.detail.ishow;
    this.setData({
      ishow,
    });
  },
  tapLesson(e) {
    //章节切换
    const that = this;
    let { id } = e.currentTarget.dataset;
    let  chapter  = this.data.chapter;
    for (let i in chapter) {
      chapter[i].active = false;
      if (!this.data.isBuy && !chapter[i].free && chapter[i].id == id) {
        wx.showToast({
          icon: "none",
          title: "请先购买",
        });

        chapter.forEach((res) => {
          //手动修正
          res.active = false;
        });
        chapter[i].active = true;
        that.setData({
          isBuy2: false,
          videoSrc:chapter[i].url,//试看
          isAutoplay:true
        });
        break;
      }
      this.setData({
        isfree: true,
        isBuy2: true,
      });
      if (chapter[i].id == id) {
        chapter[i].active = true;
        that.setData({
          curtitle: chapter[i].title,
          videoSrc:chapter[i].url,
          isAutoplay:true
        });
      } else {
        chapter[i].active = false;
      }
    }
   
    this.setData({
      chapter,
    });
  },
  switchTab(e) {
    let { id } = e.currentTarget.dataset;
    if (id) {
      this.setData({
        tabId: 1,
      });
    } else {
      this.setData({
        tabId: 0,
      });
    }
  },
  getDesc(id){//只获取描述内容
    const that = this;
    wx.request({
      url: that.data.baseUrl + "lesson/detail/" + id,
      data: {},
      header: {
        "Content-Type": "application/json",
      //  Authorization: "Bearer " + app.globalData.token,
      },
      success: (res) => {
        let data = res.data.data;
        that.setData({
          descContent: data.content,
        })
      },
    });
  },
  getdetailLesson(id) {
    //获取课程详情
    const that = this;
    wx.request({
      url: that.data.baseUrl + "lesson/detail/" + id,
      data: {},
      header: {
        "Content-Type": "application/json",
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
            that.setData({
              isBuy:true,
              isBuy2:true,
              isLike:data.collect
            })
        }
        data.chapter[0].active=true
        
        that.setData({
          lessonDetail: data,
          chapter:data.chapter,
          videoSrc:data.chapter[0].url,//试看
        });

      },
    });
  },
  getMoreDiscuss() {
    this.setData({
      moreDiscuss:true
    })
    //加载更多评论
    let { id, page } = this.data;
    this.getCommentList({
      id,
      page,
      limit: 4,
    });
  },
  getCommentList(obj) {
    //获取课程的评论列表
    const that = this;
    wx.request({
      url: that.data.baseUrl + "lesson/reply/" + obj.id,
      data: obj,
      success: (res) => {
        let { list, count } = res.data.data;
        let page = that.data.page;
        let comment = that.data.comment;
        comment = comment.concat(list);
        if (comment.length == count) {
          that.setData({
            over: true,
          });
        }
        that.setData({
          moreDiscuss:false,
          comment,
          page: page + 1,
          count,
        });
      },
    });
  },
  goBuy(e) { 
    let { id } = e.currentTarget.dataset;
    const that = this;

    if(!app.globalData.token){
      that.setData({
        ishow:true
      })
      return false
    }
   
    wx.request({
      url: that.data.baseUrl + "lesson/order/buy",
      data: {
        lesson_id: that.data.id,
      },
      header: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + app.globalData.token,
      },
      success: (res) => {
        let data = res.data; 
        wx.getStorage({
          key: 'userinfo',
          success:(res)=>{
            that.setData({
              avatar:res.data.avatar
            })
          }
        })
        if(data.status==200 && !data.data.appId){//不需要支付的订单
          that.setData({
            isBuy:true,
            isBuy2:true
          })
          that.getdetailLesson(that.data.id)
          wx.reLaunch({
            url: '../pay-result/pay-result?id='+data.data.order_id+'&edu_id=' + that.data.id + '&type='+that.data.lessonDetail.type,
          })
        }else {
          let info ={}
          info=data.data
          wx.requestPayment({
            timeStamp:info.timestamp,
            nonceStr:info.nonceStr,
            package:info.package,
            signType:info.signType,
            paySign:info.paySign,
            success (res) {
              that.getdetailLesson(that.data.id)
              wx.reLaunch({
                url: '../pay-result/pay-result?id='+data.data.order_id+'&edu_id=' + that.data.id + '&type='+that.data.lessonDetail.type,
              })
             },
            fail (res) { 
              wx.showToast({
                icon:"none",
                title: '您已取消支付',
              })
            }
          })
        }
        
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
      });
  },
  onPlay(){},

  onTimeUpdate(e){
    const { currentTime, duration } = e.detail
    this.setData({
      currentTime
    })
  },
  
  onLoad: function (options) {
    let {id} = options;
    this.getDesc(id)
    this.silenceAuth()
      
      
    const that = this;
    this.setData({
      id: parseInt(id),
    });
    this.getCommentList({
      id: parseInt(id),
      page: 1,
      limit: 4,
    });
    wx.getStorage({
      key: 'userinfo',
      success:(res)=>{
        that.setData({
          avatar:res.data.avatar
        })
      }
    })
  },
  onReady: function () {
    const that =this
    wx.getSystemInfo({
      success (res) {
        that.setData({
          per:res.windowWidth/375
        })
        
      }
    })
    this.videoContext = wx.createVideoContext('myVideo')
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
    const query = wx.createSelectorQuery()
    const that = this
    
    setTimeout(function(){
      query.select(".mul").boundingClientRect(function (res) {
        let height = res.height
        
        if(height>parseInt(that.data.desc*that.data.per)){//显示更多
          that.setData({
            showMore:true,
            height:height
            
          })
        }
      }).exec()
    },700)

    wx.getStorage({
      key: 'videoTime'+this.data.id,
      success:(res)=>{
        this.setData({
          initialTime:res.data
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    wx.setStorage({
      key:'videoTime'+this.data.id,
      data:this.data.currentTime
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    wx.setStorage({
      key:'videoTime'+this.data.id,
      data:this.data.currentTime
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    let that =this
    return {
    //  title: '自定义转发标题',
      path: 'pages/lesson-detail/lesson-detail?id='+that.data.id
    }
    if (res.from === 'button') {
      // 来自页面内转发按钮
    }
    

  },
});
