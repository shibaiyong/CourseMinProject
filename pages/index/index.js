const _util=require('../../utils/request')
const app = getApp()
Page({
  data: {
    static: app.globalData.staticUrl,
    baseUrl:app.globalData.baseUrl,
    isLoading:true,
    recommend_title:'',
    leader_title:'',
    outdoor_title:'',
    goods:[
      // {
      //   id:1,
      //   sign:'培训',
      //   image:'/banner@2x.png',
      //   title:'山地自行车领队培训',
      //   price:4080.00
      // },
      // {
      //   id:2,
      //   sign:'课程',
      //   image:'/banner@2x.png',
      //   title:'山地自行车领队培训',
      //   price:0
      // }
    ],
    yewai:[
      // {
      //   id:1,
      //   sign:'直播',
      //   image:'/banner@2x.png',
      //   title:'山地自行车越野',
      //   price:4080.00
      // },
      // {
      //   id:2,
      //   sign:'培训',
      //   image:'/banner@2x.png',
      //   title:'山地自行车越野',
      //   price:0
      // },
      // {
      //   id:3,
      //   sign:'培训',
      //   image:'/banner@2x.png',
      //   title:'山地自行车越野',
      //   price:0
      // },
      // {
      //   id:4,
      //   sign:'培训',
      //   image:'/banner@2x.png',
      //   title:'山地自行车越野',
      //   price:0
      // },
    ],
    banner:[
      // {
      //   id:1,
      //   image:'/banner@2x.png',
      //   url:"aaa"
      // },
      // {
      //   id:2,
      //   image:'/banner@2x.png',
      //   url:"aaa"
      // },
      // {
      //   id:3,
      //   image:'/banner@2x.png',
      //   url:"aaa"
      // },
    ],
    indicatorColor:'#999',
    indicatorActiveColor:'#fff',
    indicatorDots: true,
    vertical: false,
    autoplay: true,
    circular: false,
    interval: 2000,
    duration: 1000,
    previousMargin: 0,
    nextMargin: 0
  },
  swiperTo(e){
    let {url}=e.currentTarget.dataset
    if(url=='/pages/edu-list/edu-list' || url=='/pages/lesson-list/lesson-list'){
      wx.switchTab({
        url: url
      })
    }else{
      wx.navigateTo({
        url: url
      })
    }
    
  },
  goMinin(e){
    var i =e.currentTarget.dataset.id
    if(i==1){
      wx.navigateToMiniProgram({
        appId: 'wx67c92acbbfd22386',
        path: 'pages/activity/index',
        extraData: { 
          foo: 'bar'
        },
        envVersion: 'release',
        success(res) {
          // 打开成功
        }
      })
    }else{
      wx.navigateToMiniProgram({
        //appId: 'wx2ea8856aa18cbb3b',
        appId: 'wx5c0e85b2aac6b42f',
        path: 'pages/index/index',
        extraData: { //需要传递给目标小程序的数据，目标小程序可在 App.onLaunch，App.onShow 中获取到这份数据
          foo: 'bar'
        },
        envVersion: 'release', //develop	开发版     trial 体验版  release 正式版
        success(res) {
          // 打开成功
        }
      })
    }
  },
  goDetail(e){
    if(e.detail.id){
      var id =e.detail.id
      var type =parseInt(e.detail.type)
    }else{
      var id =e.currentTarget.dataset.id
      var type =parseInt(e.currentTarget.dataset.type)
    }
    // 1课程 2培训 3直播 
    switch (type) {
      case 1:
        wx.navigateTo({
          url: '../lesson-detail/lesson-detail?id='+id,
        })
        break;
        case 2:
          wx.navigateTo({
            url: '../edu-detail/edu-detail?id='+id
          })
        break;
        case 3:
        wx.navigateTo({
          url: '../live-detail/live-detail?id='+id,
        })
        break;
    
      default:
        break;
    }
  
  },

 getIndex(){
   const that =this
  wx.request({
    url: that.data.baseUrl+'lesson/index',
    success:res=>{
      that.setData({
        isLoading:false
      })
      if(res.data.status != 200){
        wx.showToast({
          title: res.data.msg,
          icon:"none"
        })
        return false
      }
      let {banner,recommend,leader,outdoor,recommend_title,leader_title,outdoor_title}=res.data.data
      // let recommend1 = recommend.map(item => {
      //   if(item.lesson_type==1){
      //     item.lesson_type='课程'
      //   }else if(item.lesson_type==2){
      //     item.lesson_type='培训'
      //   }else if(item.lesson_type==3){
      //     item.lesson_type='直播 '
      //   }
      //   return item
      // });
      // console.log('recommend1',recommend1)
      that.setData({
        banner,
        recommend:recommend,
        leader,
        outdoor,
        recommend_title,
        leader_title,
        outdoor_title
      })
      
    }
  })
 },
  onLoad: function () {
    this.getIndex()
    _util._onLive()
  },
  onShareAppMessage: function () {
    let that =this
   
    if (res.from === 'button') {
      // 来自页面内转发按钮
      
    }
  }
})
