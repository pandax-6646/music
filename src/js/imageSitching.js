(function ($, root) {
  // 类似窗口向后移动一个碟盘，然后将最右边碟盘移动到最左边，并在切盘碟的过渡动画完成后将class类名改正     
  //点击切歌图片过渡运动 形参：$切入盘,$补充盘，切入盘class类名,补充盘class类名，切入的关键帧名，切出盘的关键帧名，切出盘切出到的位置，补充盘补充的位置
  function imgClickMove($In, $Move, In, Move, FuncIn, FuncOut, OutTo, MoveTo) {
    $('.arm-img').removeClass('playing');

    

    $In.css({
      'animation': FuncIn + '.5s cubic-bezier(0, 0, 1, 1) forwards'
    }).addClass('moveIn')
    $('.curr-img').css({
      'animation': FuncOut + '.5s cubic-bezier(0, 0, 1, 1) forwards'
    }).addClass('moveOut');

    //点击切歌后重新渲染这三张图片

    setTimeout(function () {
      $('.moveIn').attr('class', 'img-box curr-img').css({
        'left': '0px',
        'transform': 'translate3d(0px, 0px, 0px)',
        'animation': 'none'

        // 每次让切出去的磁盘的初始旋转角度置0
      }).find('div').css({
        'transform': 'translatez(0px) rotateZ(0deg)',
        'transition': 'none'
      }).attr('data-deg', '0');
      $Move.addClass(In).removeClass(Move).css({
        'left': '0px',
        'transform': 'translate3d(' + MoveTo + ', 0px, 0px)',
        'animation': 'none'
      })
      $('.moveOut').addClass(Move).removeClass('curr-img moveOut').css({
        'left': '0px',
        'transform': 'translate3d(' + OutTo + ', 0px, 0px)',
        'animation': 'none'
      })

      // rotate(0);
      getCookie();
      root.rendering(dataList, currSongIndex);
      songName()
    }, 600)
  }


  //  形参分别为:$切入盘,$补充盘，切入盘class类名,补充盘class类名，切入盘切入到的位置，切出盘切出到的位置，补充盘补充的位置
  function imgTouchMove($In, $Move, In, Move, InTo, OutTo, MoveTo) {

    $In.css({
      'left': InTo,
      'transition': 'left .3s cubic-bezier(0, 0, 1, 1)'
    }).addClass('moveIn')


    $('.curr-img').css({
      'left': OutTo,
      'transition': 'left .3s cubic-bezier(0, 0, 1, 1)'
    }).addClass('moveOut')


    $Move.css({
      'left': MoveTo,
      'transform': 'translate3d(-142%, 0px, 0px)',
      'transition': 'none',
    })

    getCookie();

    setTimeout(function () {


      // 移动图片后重新排列图片类名并重绘图片

      $('.moveIn').attr('class', 'img-box curr-img').css({
        'left': 0,
        'transform': 'translate3d(0px, 0px ,0px)',
        'transition': 'none'
      })
      $Move.addClass(In).removeClass(Move).css({
        'left': '0',
        'transform': 'translate3d(' + -InTo + ', 0px, 0px)',
        'transition': 'none',
      })
      $('.moveOut').addClass(Move).removeClass('moveOut curr-img').css({
        'left': 0,
        'transform': 'translate3d(' + OutTo + ', 0px, 0px)',
        'transition': 'none'
      })

      root.rendering(dataList, currSongIndex)
    }, 400)

    setTimeout(function () {
      deg = $('.curr-img').attr('data-deg');
      rotate(deg);

      $('.arm-img').addClass('playing')

    }, 500)
  }


  root.switch = {
    imgClickMove: imgClickMove,
    imgTouchMove: imgTouchMove
  }

})(window.Zepto, window.player || (window.player = {}))