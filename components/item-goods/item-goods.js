const app = getApp()
Component({
  properties: {
   item:Object,
   isLessonList:{
     type:Boolean,
     default:false
   }
  },
  data: {
    static: app.globalData.staticUrl,
    item:{},
    
  },
  methods: {
    detailLesson(e){
      let {id,type}=e.currentTarget.dataset
      let { is_audio, is_text, is_video } = this.data.item
      this.triggerEvent('detailLesson',{ id, type, is_audio, is_text, is_video })
    },
    goDetail(e){
      let {id,type}=e.currentTarget.dataset
      this.triggerEvent('goDetail',{id,type})
    }
  },
  observers: {
    'item': function (val) {
      if(val) return;
      this.setData({
        item:val
      })
    }
  },
})
