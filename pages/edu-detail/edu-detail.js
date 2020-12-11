const app = getApp()
const _until=require('../../utils/util')
let { _getUserInfo }= require('../../utils/request')

Page({
  data: {
    price:false,//是否免费
    static: app.globalData.staticUrl,
    baseUrl: app.globalData.baseUrl,
    like:'/like-un-white.png',
    id:0, //详情id
    isBuy: false, //是否购买
    lessonDetail: {},
    isLike:false,
    ishow: 0,//微信授权    0 //关闭  1 /新用户   2 待授权手机号
    isLoading:true,
    othertime:'00天00时',
    code:'',
    isShare:false,
    isShowPoster:false,
    random:1,
    isAutoplay:false
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
  joinUp(e){//支付
    let { id } = e.currentTarget.dataset
    const that =this
    if(!app.globalData.token){
      that.setData({
        ishow:true
      })
      return false
    }


    wx.request({
      url: that.data.baseUrl + "lesson/order/buy",
      data:{
        lesson_id:id
      },
      header: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + app.globalData.token,
      },
      success: (res) => {
        that.setData({
          isLoading:false
        })
        let data = res.data; 
        if(data.status ==400){
          wx.showToast({
            title: data.msg,
            icon:'none'
          })
          return false
        }
        if(data.status==200 && !data.data.appId){//不需要支付的订单
          that.setData({
            isBuy:true,
            isBuy2:true
          })
          // wx.showToast({
          //   title: '购买成功',
          //   icon:'none'
          // })
          wx.reLaunch({
            url: '../pay-result/pay-result?id='+data.data.order_id,
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
              wx.reLaunch({
                url: '../pay-result/pay-result?id='+data.data.order_id+'&edu_id=' + that.data.id + '&type=2',
              })
             },
            fail (res) {

            }
          })
        }
      }
    })
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
        this.setData({
          othertime: app.gameOver(start_time,end_time).othertime
        })
        if(start_time){
          data.start_time =start_time.replace(/\-/g,".").split(' ')[0]
        }
        if(end_time){
          data.end_time =end_time.replace(/\-/g,".").split(' ')[0]
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
  call(e){
    let { phone } = e.currentTarget.dataset;
    phone =parseInt(phone).toString()
    wx.makePhoneCall({
      phoneNumber: phone,
    })
  },
  createAppCode(){
    wx.request({
      url: this.data.baseUrl + "lesson/code/" + this.data.id,
      data: {},
      header: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + app.globalData.token,
      },
      success: (res) => {
        
        if(res.data.status==200){
          console.log(res.data.data.code)
          this.setData({
            code:res.data.data.code
          })
        }
      }
    })
  },

  toShare(){
    this.setData({
      isShare:true
    })
  },

  closeShare( e ){
    let { name } = e.currentTarget.dataset
    if(name == 'share'){
      this.setData({
        isShare:false
      })
    }else{
      this.setData({
        isShowPoster:false
      })
    }
    
  },

  createPoster(){
    this.setData({
      random:++this.data.random
    })
    this.setData({
      isShare:false
    })
    if(this.ctx){
      this.ctx.clear
    }
    this.downLoadGoodImage()
  },

  //下载商品图片
  downLoadGoodImage(){
    let goodsImageUrl = "https://test.vvip333.com/static/images/123.jpg";
    let qrcodeUrl = "../../images/1.jpg";
    //let goodsImageUrl = this.data.lessonDetail.image_input
    //let code = this.data.code
    wx.showLoading({
      title: '生成中',
      mask: true
    })
    //获取图片的信息，大小，尺寸等
    wx.getImageInfo({
      src: goodsImageUrl,
      success: (res) => {
        var goodsImage = res.path
        wx.getImageInfo({
          src: qrcodeUrl,
          success: (res) => {
            console.log(res)
            wx.hideLoading()
            var qrcodeImage = '../../'+res.path
            this.sharePosteCanvas(goodsImage,qrcodeImage) //生成海报
          },
          fail(){
            wx.showToast({
              title: '二维码下载失败！',
              icon: 'none',
              duration: 2000
            })
          }
        })
      },
      fail(){
        wx.showToast({
          title: '图片下载失败！',
          icon: 'none',
          duration: 2000
        })
      }
    })
  },

  sharePosteCanvas(image,qrcode) {
    let ctx = wx.createCanvasContext('canvasBox'+this.data.random, this)
    this.ctx = ctx
    // 设置背景颜色
    ctx.clearRect(0,0,210,300)
    ctx.setFillStyle('#FFF')
    ctx.fillRect(0, 0, 380, 600)
    //将图片绘制到canvas上。
    ctx.drawImage(image,0,0,210,170)
    ctx.drawImage(qrcode,100,180,100,100)
    this.setPrice(ctx)
    this.setPriceTrough(ctx)
    this.setTitle(ctx)
    ctx.draw()
    this.setData({
      isShowPoster:true
    })
  },

  //点击保存到相册
  saveShareImg() {
    var that = this
    wx.showLoading({
      title: '正在保存',
      mask: true
    })
    wx.canvasToTempFilePath({
      canvasId: 'canvasBox'+this.data.random,
      success: res => {
        wx.hideLoading()
        var tempFilePath = res.tempFilePath
        that.checkWritePhotosAlbum(tempFilePath)
      },
      fail: function(err) {
        console.log(err)
      }
    })
  },

  checkWritePhotosAlbum: function(filePath) {
    var that = this
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success() {
              that.saveToPhoto(filePath)
            },
            fail() {
              wx.openSetting({
                success(res) {
                  if (res.authSetting['scope.writePhotosAlbum']) {
                    that.saveToPhoto(filePath)
                  }
                },
                fail(res) {
                  wx.showToast({
                    title: '您没有授权，无法保存到相册',
                    icon: 'none'
                  })
                }
              })
            }
          })
        } else {
          that.saveToPhoto(filePath)
        }
      }
    })
  },

  // 保存到相册
  saveToPhoto: function(filePath) {
    wx.saveImageToPhotosAlbum({
      filePath: filePath,
      success(res) {
        wx.showModal({
          content: '图片已保存到相册，赶紧晒一下吧~',
          showCancel: false,
          confirmText: '好的',
          confirmColor: '#333',
          success: function(res) {
            
          },
          fail: function(res) {
            console.log(res)
          }
        })
      },
      fail: function(res) {
        wx.showToast({
          title: res.errMsg,
          icon: 'none',
          duration: 2000
        })
      }
    })
  },

  setPrice: function(ctx) {
    let price = this.data.lessonDetail.price
    ctx.beginPath()
    ctx.setFontSize(18)
    ctx.fillStyle="red"
    ctx.fillText('￥' + price,10,200)
  },
  setPriceTrough(ctx){
    let ot_price = this.data.lessonDetail.ot_price
    ctx.beginPath()
    ctx.setFontSize(13)
    ctx.fillStyle="#999999"
    ctx.fillText('￥' + ot_price, 12, 225)
    ctx.beginPath()
    ctx.strokeStyle="#999999"
    ctx.moveTo(10,220)
    ctx.lineTo(62,220)
    ctx.stroke()
  },

  setTitle(ctx){
    let title = this.data.lessonDetail.title
    ctx.beginPath()
    ctx.setFontSize(16)
    ctx.fillStyle="black"
    ctx.fillText(title, 10, 265)
  },

  onLoad: function (options) {
    this.silenceAuth()
    let {id} = options
    // id=33
    this.setData({
      id: parseInt(id),
    });

    this.createAppCode()

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