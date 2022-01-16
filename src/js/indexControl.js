(function ($, root) {
  function Control(len, index) {
    this.index = index;
    this.len = len;
  }
  Control.prototype = {
    prev: function () {

      return this.getIndex(-1);
    },
    next: function () {

      return this.getIndex(1);
    },
    getIndex: function (val) {

      //当前歌曲的索引
      var index = this.index;

      //数据总数
      var len = this.len;

      // 改变后的索引
      var currIndex = (index + val + len) % len;
      this.index = currIndex;
      return currIndex;
    }
  }
  root.controlIndex = Control;
})(window.Zepto, window.player || (window.player = {}))