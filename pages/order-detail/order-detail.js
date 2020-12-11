const app = getApp()
const _until=require('../../utils/util')
Page({
  data: {
    static: app.globalData.staticUrl,
    baseUrl:app.globalData.baseUrl,
    order:true,//   false  订单未付款  true  订单已付款
    cancelOrder:false, //订单取消
    detail:{},
  },
  copy(e){
    let {id}= e.currentTarget.dataset
    wx.setClipboardData({
      data: id,
      success (res) {
        wx.getClipboardData({
          success (res) {
           // console.log(res.data) // data
          }
        })
      }
    })
  },
  getOrderDetail(id){
    const that =this
    wx.request({
      url: that.data.baseUrl + "/lesson/order/detail/"+id,
      data:{},
      header: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + app.globalData.token,
      },
      success: (res) => {
        if(res.data.status!=200){
          wx.showToast({
            title: res.data.msg,
            icon:'none'
          })
        }
       // console.log('order-list___',res.data.data)
        let add_time = res.data.data.add_time
        if(res.data.data.pay_time){
          let pay_time=res.data.data.pay_time
          res.data.data.pay_time=_until.formatTime2(pay_time)
        }
       
        //console.log('--------------',add_time,_until.formatTime2(add_time))
        res.data.data.add_time= _until.formatTime2(add_time)
        that.setData({
          detail:res.data.data
        })
      },
    });
  },
  delorder(){
    const that =this
    wx.showModal({
      title: '提示',
      content: '确认要删除该订单信息吗?',
      success (res) {
        if (res.confirm) {
          wx.request({
            url: that.data.baseUrl + "/lesson/order/del",
            data:{
              id:that.data.detail.id
            },
            header: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + app.globalData.token,
            },
            success: (res) => {
              //console.log('order-list___222',res.data)
              if(res.data.status==200){
                wx.showToast({
                  icon:'none',
                  title: '已删除',
                })
                setTimeout(()=>{
                  // wx.navigateBack({
                  //   delta: 1,
                  // })
                  wx.redirectTo({
                    url: '../my-order/my-order',
                  })
                },500)
              }else{
                wx.showToast({
                  icon:'none',
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let {id}=options
    this.getOrderDetail(id)
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

  }
})