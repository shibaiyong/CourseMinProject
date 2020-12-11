const app= getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    baseUrl:app.globalData.baseUrl,
    enhanced:false,
    type:1, //直播type=3  其他 type=1
    navList:[],
    list:[],
    page:1,
    count:0,
    over:false,
    isLoading:true
  },
 
  detailLesson(e){
   let {id,type,is_audio, is_video ,is_text}=e.detail
   if(type == 3){  //type=3  直播类型
    wx.navigateTo({
      url: '../live-detail/live-detail?id='+id,
    })
   }else if(is_video){
    wx.navigateTo({
      url: '../lesson-detail/lesson-detail?id='+id,
    })
   }else if(is_audio){

    wx.navigateTo({
      url: '../lesson-detail/lesson-listen?id='+id,
    })

   }else if(is_text){

    wx.navigateTo({
      url: '../lesson-detail/lesson-text?id='+id,
    })

   }
    
  },
  tabNav(e){//切换导航
    const that =this
    that.setData({
      isLoading:true
    })
    
    let index = e.currentTarget.dataset.id
    wx.setStorage({
      key:"tabflag",
      data:index
    })
    
    
    let navListArr = that.data.navList
    for(let item in that.data.navList){
      if(navListArr[item].id == index){
        navListArr[item].isactive =true
        that.setData({
          list:[],
          over:false,
          count:0,
          page:1
        })
        if(navListArr[item].pid==3){//直播类型
          that.setData({
            type:3
          })
          that.getLesson({
            type:3,
            page:1,
            limit:10
          })
        }else{
          that.setData({
            type:1
          })
          that.getLesson({
            category_id:index,
            type:1,
            page:1,
            limit:10
          })
        }
        
      }else{
        navListArr[item].isactive =false
      }
    }
    that.setData({
      navList:navListArr
    })
  },
  handleTabVal(flag){
    console.log(flag)
    const that =this
    that.setData({
      isLoading:true
    })
    if(flag){
      var index = flag
    }
    let navListArr = that.data.navList
    for(let item in that.data.navList){
      if(navListArr[item].id == index){
        navListArr[item].isactive =true
        that.setData({
          list:[],
          over:false,
          count:0,
          page:1
        })
        if(navListArr[item].pid==3){//直播类型
          that.setData({
            type:3
          })
          that.getLesson({
            type:3,
            page:1,
            limit:10
          })
        }else{
          that.setData({
            type:1
          })
          that.getLesson({
            category_id:index,
            type:1,
            page:1,
            limit:10
          })
        }
        
      }else{
        navListArr[item].isactive =false
      }
    }
    that.setData({
      navList:navListArr
    })
    console.log(that.data.navList)
  },
  //获取课程列表
  getLesson(obj){
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
        let data =res.data.data.list
        let list =that.data.list.concat(data)
        that.setData({
          count:res.data.data.count
        })
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
        that.setData({
          list
        })
      }
    })
  },
  //获取nav
  getNav(){
    const that =this
    wx.request({
      url: that.data.baseUrl+'lesson/category',
      success:res=>{
        let data =res.data.data
        let newData=[]
        for(let i=0;i<data.length;i++){
          if(i==0){
            data[i].isactive=true
          }
          newData.push(data[i])
        }
        
        if(newData[0].pid==3){
          that.setData({
            type:3
          })
          that.getLesson({
            //category_id:newData[0].id,
            type:3,
            page:1,
            limit:10,
          })
        }else{
          that.setData({
            type:1
          })
          that.getLesson({
            category_id:newData[0].id,
            type:1,
            page:1,
            limit:10,
          })
        }
        
        that.setData({
          navList:newData
        })
        
        setTimeout(()=>{
          wx.getStorage({
            key: 'tabflag',
            success:(res)=>{
              this.handleTabVal(res.data)
            }
          })
        },700)
        
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    let that =this
      if(app.globalData.isAndroid){
        that.setData({
          enhanced:true
        })
      }
      // this.getNav()
      
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
      navList:[],
      list:[],
      page:1,
      count:0,
      over:false,
      isLoading:true
    })
    this.getNav()
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
    let navList=this.data.navList
    let page=this.data.page
    let type= this.data.type  //直播  type=3   其他type=1
    navList.forEach(item=>{
      if(item.isactive===true){
        if(type==3){ //直播
          that.getLesson({
            type,
            page,
            limit:10
          })
        }else{
          that.getLesson({
            category_id:item.id,
           // type:1,
            type,
            page,
            limit:10
          })
        }
        
      }
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
        
  }
})