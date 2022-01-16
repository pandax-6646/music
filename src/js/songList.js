(function ($, root) {

  function List(data) {
    this.data = data;
    this.index;

  }
  List.prototype = {
    renderListDom: function () {
      var str = '';
      var len = this.data.length;
      for (var i = 0; i < len; i++) {
        str += ' <li data-index="' + i + '">\
                <span>' + this.data[i].song + '-' + this.data[i].singer + '</span>\
                <p class="bj-clear"></p>\
            </li>';
      }

      // 每次点击list图标都重新渲染一个新的list列表
      $('.count', '.playList').text('(' + len + ')');
      $('ul', '.songList').html(str);
    },
  }

  root.songList = List;
})(window.Zepto, window.player || (window.player = {}))