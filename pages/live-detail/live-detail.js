const app = getApp()
const _until=require('../../utils/util')
let { _getUserInfo }= require('../../utils/request')

Page({
  data: {
    customParams:{},//直播携带额外参数
    price:false,//是否免费
    static: app.globalData.staticUrl,
    baseUrl: app.globalData.baseUrl,
    like:'/like-un-white.png',
    id:0, //详情id
    isBuy: false, //是否购买
    isBuy: false, //是否购买
    isBuy2: false, //是否购买
    lessonDetail: {},
    isLike:false,
    ishow: 0,//微信授权    0 //关闭  1 /新用户   2 待授权手机号
    isLoading:true
  },
  collect(e){
    const that =this
    let { like } = e.currentTarget.dataset;
    let msg=''
    console.log('like________',like)
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
  // islike(){
  //   var that =this
  //     if(this.data.like=='/like-icon.png'){
  //       that.setData({
  //         like:'/like-un-white.png'
  //       })
  //       wx.showToast({
  //         title: '已取消收藏',
  //         icon:"none"
  //       })
  //     }else{
  //       that.setData({
  //         like:'/like-icon.png'
  //       })
  //       wx.showToast({
  //         title: '已收藏',
  //         icon:"none"
  //       })
  //     }
  // },
  // joinUp(e){//报名
  //   let { id } = e.currentTarget.dataset;
  //   const that =this
  //   if(!app.globalData.token){
  //     that.setData({
  //       ishow:true
  //     })
  //     return false
  //   }
    
  //   wx.navigateTo({
  //     url: '../join-up/join-up?id='+that.data.id,
  //   })
  // },
  // getinfoBack(e){
  //   const that =this
  //   that.getdetailLesson(that.data.id);
  // },
  // ishowBack(e) {
  //   let ishow = e.detail.ishow;
  //   this.setData({
  //     ishow,
  //   });
  // },
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
  goBuy(e) { 
    console.log('e_____________',e.currentTarget.dataset,e)
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
  getdetailLesson(id) {
    //获取培训详情
    const that = this;
    wx.request({
      url: that.data.baseUrl + "lesson/detail/" + id,
      data: {},
      header: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + app.globalData.token,
      },
      success: (res) => {
        if(res.data.status!=200){
          wx.showToast({
            title: res.data.msg,
            icon:"none"
          })
        }
       that.setData({ 
        isLoading:false
       })
        let data = res.data.data;
        that.setData({
          isLike:data.collect
        })
        //   "is_buy": 0,//是否已购买 0未登录或者未购买1已下单未支付2已支付
        if(!app.globalData.token){//未登录

        }else if(data.is_buy==0){//未购买

        }else if(data.is_buy==1){//已下单未支付

        }else if(data.is_buy==2){//已支付
            that.setData({
              isBuy:true,
              isBuy2:true,
              
            })
        } 
        let start_time= data.start_time
        let end_time= data.end_time
        if(start_time){
          data.start_time =start_time.replace(/\-/g,".")
        }
        if(end_time){
          data.end_time =end_time.replace(/\-/g,".")
        }
        if(data.content){
          data.content=_until.formatRichText(data.content)
        }
        if(data.train_overview){
          data.train_overview =_until.formatRichText(data.train_overview)
        }
        if(data.train_coach_desc){
          data.train_coach_desc =_until.formatRichText(data.train_coach_desc)
        }
        // console.log('格式化完的图片————————————',data.train_coach_desc )
        that.setData({
          lessonDetail: data,
          //chapter:data.chapter
        });
      },
    });
  },
  onLoad: function (options) {
    this.silenceAuth()
    let {id} = options
  //  id=45
    this.setData({
      id: parseInt(id),
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
    let that =this
    return {
      //  title: '自定义转发标题',
        path: 'pages/edu-detail/edu-detail?id='+that.data.id
    }
    if (res.from === 'button') {
      // 来自页面内转发按钮
      
    }
  }
})