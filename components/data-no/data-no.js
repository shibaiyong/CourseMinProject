// components/data-no/data-no.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    desc: String,
    src: String,
    type: {
      type: Number,
      default: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    golist(e) {
      let {
        type
      } = e.currentTarget.dataset
      switch (type) {
        case 1:
          wx.switchTab({
            url: '/pages/lesson-list/lesson-list',
          })
         
          break;
        case 2:
          wx.switchTab({
            url: '/pages/edu-list/edu-list',
          })
          
          break;
        case 3:
          //直播
          wx.switchTab({
            url: '/pages/lesson-list/lesson-list',
          })
          // wx.navigateTo({
          //   url: '../../pages/edu-list/edu-list',
          // })
          break;
        default:
          break;
      }
    }
  }
})