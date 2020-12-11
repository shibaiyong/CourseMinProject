// components/loading/loading.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isLoading:{
      type:Boolean,
      default:true
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    alpha: [1,1,1,1,1]
  },

  /**
   * 组件的方法列表
   */
  methods: {

  },
  /*组件生命周期*/ 
  lifetimes: {
    created() {
      console.log("在组件实例刚刚被创建时执行")
    },
    attached() { 
      console.log("在组件实例进入页面节点树时执行")
    },
    ready() {
      console.log("在组件在视图层布局完成后执行")
      var self = this;
      var _index = 0;
      var _alpha = self.data.alpha;
      var _speed = 500;
      var timer = setInterval(function () {
        var an_show = wx.createAnimation({});
        var an_hide = wx.createAnimation({});
        an_show.opacity(1).step({ duration: _speed });
        an_hide.opacity(0).step({ duration: _speed });
        _alpha[_index] = an_show;
        _alpha[_index == 0 ? 4 : _index - 1] = an_hide;
        self.setData({
          alpha: _alpha
        })
        _index = _index == 4 ? 0 : _index + 1;
      }, _speed);
    },
    moved() {
      console.log("在组件实例被移动到节点树另一个位置时执行")
    },
    detached() {
      console.log("在组件实例被从页面节点树移除时执行")
    },
    error() {
      console.log("每当组件方法抛出错误时执行")
    },
    /*组件所在页面的生命周期 */
    pageLifetimes: {
      show: function () {
        // 页面被展示
        console.log("页面被展示")
      },
      hide: function () {
        // 页面被隐藏
        console.log("页面被隐藏")
      },
      resize: function (size) {
        // 页面尺寸变化
        console.log("页面尺寸变化")
      }
    }
   
  }
})
