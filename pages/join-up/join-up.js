const app = getApp()
Page({
  data: {
    static: app.globalData.staticUrl,
    baseUrl:app.globalData.baseUrl,
    w:'/w-un.png',
    m:'/m-a.png',
    joinInfo:{
      id:0,
      name:'hahah',// 姓名
      gender:'1',// 性别  默认男
      email:'',//邮箱
      idcard: '',//身份证号码
      profession:'',// 职业
      mobile:'',// 手机号 
      user_remark:'', //用户备注 选填
      isAgree:true
    },
    isAgree:true,
    wSelected:'/w-a.png',
    wSelectedun:'/w-un.png',
    mSelected:'/m-a.png',
    mSelectedun:'/m-un.png',
    isLoading:false,
    isSuccess:false,
    edu_id:'',
    type:2
  },
  showAgrren(e){
    const that = this
    wx.setStorage({
      data: that.data,
      key: 'formInfo',
    })
    wx.navigateTo({
      url: '../user-agreement/user-agreement?id='+this.data.id,
    })
  },
  checkboxChange(e){
    let val = e.detail.value[0]
    
    if( val ){
      this.data.joinInfo.isAgree = true
    }else{
      this.data.joinInfo.isAgree = false
    }

    this.setData({
      joinInfo:this.data.joinInfo
    })
    
  },
  inputWatch(e){
    let name = e.currentTarget.dataset.name
    let val = e.detail.value
    this.data.joinInfo[name] = val
    console.log(this.data.joinInfo)
    this.setData({
      joinInfo:this.data.joinInfo
    })
  },
  buy(e){//支付
    const that =this
    let {id,name,gender,email,idcard,profession,mobile,user_remark,isAgree} =that.data.joinInfo
    if(!idcard){
      wx.showToast({
        title: '请填写身份证号',
        icon:'none'
      })
      return false
    }

    if(!name){
      wx.showToast({
        title: '请填写姓名',
        icon:'none'
      })
      return false
    }

    if(!email){
      wx.showToast({
        title: '请填写邮箱',
        icon:'none'
      })
      return false
    }

    if(!mobile){
      wx.showToast({
        title: '请填写手机号',
        icon:'none'
      })
      return false
    }

    if(!profession){
      wx.showToast({
        title: '请填写职业',
        icon:'none'
      })
      return false
    }
    
    if(!isAgree){
      wx.showToast({
        title: '请同意相关协议',
        icon:'none'
      })
      return false
    }
    
    wx.request({
      url: that.data.baseUrl + "lesson/order/add_info",
      data:this.data.joinInfo,
      header: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + app.globalData.token,
      },
      success: (res) => {
        console.log(res)
        this.setData({
          isSuccess:true
        })
      }
    })
  },
  sex(e){
    let {id} =e.currentTarget.dataset
    if(id==1){
        var joinInfo = Object.assign({},this.data.joinInfo,{gender:'1'})
        this.setData({
          joinInfo,
          w:'/w-un.png',
          m:'/m-a.png'
        })
    }else if(id==2){
      var joinInfo = Object.assign({},this.data.joinInfo,{gender:'2'})
      this.setData({
        joinInfo,
        w:'/w-a.png',
        m:'/m-un.png'
      })
    }
  },
  getInfo(){
    const that =this
    wx.request({
      url: that.data.baseUrl + "lesson/order/train/info",
      data: {},
      header: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + app.globalData.token,
      },
      success: (res) => {
        
        let data = res.data; 
        if(data.status ==400){
          wx.showToast({
            title: data.msg,
            icon:'none'
          })
          return false
        }
        if(data.data){
          let arr =data.data 
          if( arr instanceof Array) {
            return false
          }
          let {name,gender,email,idcard,profession,mobile}=data.data
          
          that.setData({
            joinInfo:{
              name,
              gender,
              email,
              idcard,
              profession,
              mobile
            }
          })
        }
      },
    });
  },
  goWhere(){
    if(this.data.type==2){
      wx.reLaunch({
        url: '../edu-detail/edu-detail?id='+this.data.edu_id
      })
    }
  },
  onLoad: function (options) {
    let { id, idx, edu_id, type } = options
    this.setData({
      joinInfo:{
        id:id
      },
      edu_id,
      type
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (options) {
    
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
  // onShareAppMessage: function () {

  // }
})