// 实现页面渲染  img + info + like-btn


(function ($, root) {

  function renderImage(dataList, index) {
    var img = new Image();
    var len = dataList.length;
    img.src = dataList[index].image;

    // 图片加载回来才渲染，
    img.onload = function () {
      $('.pro-img img').attr('src', dataList[((index - 1) + len) % len].image);
      $('.curr-img img').attr('src', dataList[index].image);
      $('.next-img img').attr('src', dataList[(index + 1) % len].image);
      root.blurImg(img, $('body'));
    }
  }


  function renderInfo(info) {

    var str = '<div class="song-name">' + info.song + '</div>\
        <div class="sliger-name">' + info.singer + '</div>';

    $('.song-info').html(str);
  }

  function renderIsLike(like) {
    if (like) {
      $('.like').addClass('liking');
    } else {
      $('.like').removeClass('liking');
    }
  }


  root.rendering = function (dataList, index) {
    renderImage(dataList, index);
    renderInfo(dataList[index]);
    renderIsLike(dataList[index].isLike)
  }

})(window.Zepto, window.player || (window.player = {}))