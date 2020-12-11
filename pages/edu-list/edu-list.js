const app = getApp()
Page({
  data: {
    static: app.globalData.staticUrl,
    baseUrl:app.globalData.baseUrl,
    page:1,
    over:false, //数据加载是否完毕
    list:[],
    isLoading:true
  },
  godetail(e){
   let { id }=e.detail;
    wx.navigateTo({
      url: '../edu-detail/edu-detail?id='+id,
    })
  },
  getEduList(obj){
    const that =this;
    let page =that.data.page
    if(that.data.over){
      console.log('数据加载完毕')
      return false
    }
    wx.request({
      url: that.data.baseUrl+'lesson/list',
      data:obj,
      success:res=>{
        console.log(res)
        let data =res.data.data.list
        let list =that.data.list.concat(data)
        if(list.length<res.data.data.count){
          page =page+1
          that.setData({
            page
          })
        }else{
          that.setData({ 
            over:true
          })
        }
        that.setData({
          isLoading:false
        })
        list.forEach(item => {
          let start_time= item.start_time
          let end_time= item.end_time
          if(start_time){
            item.start_time =start_time.replace(/\-/g,".").split(' ')[0]
          }
          if(end_time){
            item.end_time =end_time.replace(/\-/g,".").split(' ')[0]
          }
        });
        that.setData({
          list
        })
      }
    })
  },
  onLoad: function (options) {
    this.setData({
      list:[],
    })
      const that = this
      // that.getEduList({
      //   type:2,
      //   page:1,
      //   limit:10,
      // })
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
    this.setData({
      page:1,
      over:false, //数据加载是否完毕
      list:[],
      isLoading:true
    })
    this.getEduList({
      type:2,
      page:1,
      limit:10,
    })
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
    const that =this
    let page=this.data.page
    that.getEduList({
      type:2,
      page,
      limit:10
    })
     
   
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})