const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    item:Object
  },

  /**
   * 组件的初始数据
   */
  data: {
    static: app.globalData.staticUrl,
    item:{}
  },

  /**
   * 组件的方法列表
   */
  methods: {
    itemInfo(e){
      let {id}=e.currentTarget.dataset
      this.triggerEvent('getInfo', {id})
    }
  }
})
