var root = window.player;

// 记录请求到的数据
var dataList;


var audio = root.audioManager;
var list;
var control;

// 记录请求到的数据总长
var len;
var timer;
var deg = 0;

var currSongIndex;
getCookie();

// 记录当前歌曲在列表的位置
var scroTop = 0;
// 歌名太长进行移动
function songName() {
  var $SongName = $('.song-info').find('.song-name')
  var str = $SongName.text();
  var len = str.length;
  var count = 0;
  var nameLen;
  for (var i = 0; i < len; i++) {
    if (str[i].charCodeAt() > 255) {
      count++;
    }
  }
  nameLen = len + count;
  if (nameLen > 30) {
    $SongName.css({
      'animation': 'songNameRuning 10s cubic-bezier(0, 0, 1, 1) alternate infinite'
    })
  } else {
    $SongName.css({
      'transform': 'translate3d(1%, 0px, 0px)'
    })
  }
}


// 获取数据
function getData(url) {
  $.ajax({
    type: 'GET',
    url: url,
    success: function (data) {
      dataList = data;
      len = data.length;

      control = new root.controlIndex(len, currSongIndex);

      // 初始化渲染图片和背景高斯模糊
      root.rendering(data, currSongIndex);

      // 初始化歌曲
      audio.getAudio(data[currSongIndex].audio)

      // 获取歌曲总时长
      root.progress.renderTotalTime(data[currSongIndex].duration);

      // 绑定非列表控件的点击事件
      bindEvent();

      //绑定移动端拖拽事件 
      bindTouch();
    },
    error: function (e) {
      console.log('未请求到音频资源，请检查网络。');
    }
  })
}

//  绑定移动端事件
function bindTouch() {

  // 进度条的滑屏事件
  function proWrap() {
    var left = $('.pro-wrap').offset().left;
    var width = parseInt($('.pro-wrap').css('width'));
    $('.slider').on({
      touchstart: function () {
        $(this).css({
          'height': '13px',
          'width': '13px',
          'top': '-5px'
        })
        root.progress.stop();
      },
      touchmove: function (e) {
        var x = e.changedTouches[0].clientX;
        var pro = (x - left) / width;
        if (pro < 0) {
          pro = 0
        } else if (pro > 1) {
          pro = 1;
        }
        audio.pause();
        root.progress.updata(pro);
        if ($('.play').attr('class').indexOf('playing') > -1) {
          $('.play').add('.arm-img').removeClass('playing');
         // 碟盘停止旋转
        //  cancelAnimationFrame(timer);
        };
      },

      touchend: function (e) {
        $(this).css({
          'height': '8px',
          'width': '8px',
          'top': '-3px'
        })
        var x = e.changedTouches[0].clientX;
        var pro = (x - left) / width;
        if (pro < 0) {
          pro = 0
        } else if (pro > 1) {
          pro = 1;
        }
        var currPlay = root.progress.conversonSecondTime(dataList[currSongIndex].duration) * pro;
        console.log(currPlay)
        root.progress.updata(pro)

        setTimeout(function () {
          root.audioManager.playTo(currPlay);
          $('.play').add('.arm-img').addClass('playing');

          songName();

          currSongIndex = $('.list').attr('song-index');


          root.progress.start(dataList[currSongIndex], pro);

          deg = $('.curr-img').attr('data-deg');
          rotate(deg);
        }, 1500)
      }
    })
  }


  // 歌盘的滑屏事件
  function songImg() {
    var currStartX;
    var currLastX;
    var currBoxLeft;
    var width = $('.curr-img').width();
    var bodyWidth = $('body').width();
    $('.img-box').on({
      touchstart: function (e) {
        currStartX = e.changedTouches[0].pageX; //最近有定位的父级
        $('.curr-img').css({
          'transition': 'none'
        })

        $('.arm-img').add('.play').removeClass('playing');
        // 碟盘停止旋转
        // cancelAnimationFrame(timer);
        console.log(timer);
      },

      touchmove: function (e) {
        currLastX = e.changedTouches[0].pageX;

        // 让当前展示的碟盘随鼠标拖拽移动
        $('.curr-img').css('left', currLastX - currStartX);

        // 如果当前展示的碟盘右碰到边框,展示上一首歌的碟盘
        currBoxLeft = $('.curr-img').offset().left;
        if (currBoxLeft + width >= bodyWidth) {
          $('.pro-img').css({
            'display': 'block',
            'transform': 'translate3d(-142%, 0px, 0px)',
            'left': currLastX - currStartX,
            'transition': 'none'
          });

          // 如果当前展示的碟盘右碰到边框,展示下一首歌的碟盘
        } else if (currBoxLeft <= 0) {
          $('.next-img').css({
            'display': 'block',
            'transform': 'translate3d(132%, 0px, 0px)',
            'left': currLastX - currStartX,
            'transition': 'none'
          })

        } else {
          $('.moveIn').css('left', 0)
        }
      },

      touchend: function (e) {

        // 切下一首歌
        if (currBoxLeft < (-width / 2)) {
          $('body').trigger('play-changer', control.next());
          root.switch.imgTouchMove($('.next-img'), $('.pro-img'), 'next-img', 'pro-img', '-132%', '-142%', '-132%')

          // $('.curr-img').attr('data-deg','0')
          // rotate(0);
          // 切上一首歌
        } else if (currBoxLeft >= bodyWidth - (width / 2)) {
          $('body').trigger('play-changer', control.prev());
          root.switch.imgTouchMove($('.pro-img'), $('.next-img'), 'pro-img', 'next-img', '142%', '132%', '0')
          $('.curr-img').attr('data-deg', 0)

          // $('.curr-img').attr('data-deg','0')
          // rotate(0);

          // 滑动碟盘切歌不成功       
        } else {

          $('.img-box').css({
            'left': 0,
            'transition': 'left .3s cubic-bezier(0, 0, 1, 1)'
          });
          if (audio.status == 'play') {
            deg = $('.curr-img').attr('data-deg');
            rotate(deg);

            $('.arm-img').add('.play').addClass('playing')
          }
        }
      }
    })
  }

  songImg();
  proWrap();
}

// 绑定事件
function bindEvent() {

  //自定义一个播放状态改变的事件
  $('body').on('play-changer', function (e, index) {
    // audio.getAudio(dataList[index].audio);
    console.log(timer);
    cancelAnimationFrame(timer);

    $('.play').add('.arm-img').removeClass('playing');

    //切歌时唱针有回位动作
    setTimeout(function () {

      // 唱针解锁
      $('.play').add('.arm-img').addClass('playing');

      // 碟盘旋转
      rotate(0);

      // 延迟播放不但更真实，而且不会在列表里切歌发上冲突
      audio.play();
    }, 400)

    $('.list').attr('song-index', index)

    // 渲染歌曲总时间
    root.progress.renderTotalTime(dataList[index].duration);

    //渲染当前播放的时长及进度条
    root.progress.start(dataList[index]);


    // 歌曲索引缓存到浏览器的cookie中
    saveCookie(index)
  })

  // 上一曲
  $('.prev').on('click', function (e) {

    // 磁盘切换
    root.switch.imgClickMove($('.pro-img'), $('.next-img'), 'pro-img', 'next-img', 'moveIn-right', 'moveOut-right', '132%', '-142%')

    // 切歌
    $('body').trigger('play-changer', control.prev());
  })

  // 下一曲
  $('.next').on('click', function (e) {

    root.switch.imgClickMove($('.next-img'), $('.pro-img'), 'next-img', 'pro-img', 'moveIn-left', 'moveOut-left', '-142%', '132%')

    $('body').trigger('play-changer', control.next());
  })

  // 播放&暂停
  $('.play').on('click', function () {
    console.log(timer);
    // pause为暂停状态
    if (audio.status == 'pause') {

      ///碟盘旋转
      deg = $('.curr-img').attr('data-deg');
      rotate(deg);

      audio.play();
      songName();

      // 渲染进度条移动和已播放的时间
      root.progress.start(dataList[currSongIndex], '', true)
    } else {
      audio.pause();

      // 碟盘停止旋转
      cancelAnimationFrame(timer);
      deg = $('.curr-img').attr('data-deg');

      // 进度条和已播放时间停止渲染
      root.progress.stop();
    }

    $('.play').add('.arm-img').toggleClass('playing');
  })

  // 收藏到我喜欢
  $('.like').on('click', function () {
    if ($(this).attr('class').indexOf('liking') != -1) {

      $(this).removeClass('liking');
      dataList[currSongIndex].isLike = false;

    } else {

      $(this).addClass('liking');
      dataList[currSongIndex].isLike = true;
    }

  });

  //列表播放音乐
  $('.list').on('click', function (e) {

    e.stopPropagatoion ? e.stopPropagatoion() : e.cancelBubble = true;

    list = new root.songList(dataList);

    $(this).addClass('playList');

    // 初始化音乐列表并给音乐绑定事件
    list.renderListDom();

    //获取最新歌曲索引
    getCookie();

    //给点击到的li标签动态添加样式
    $('ul', '.songList').find('li').eq(currSongIndex).addClass('active');
    $('.active').find('span').css('margin-left', '30px');

    // 展示列表，并移到指定地方
    $(this).find('.list-top').css({
      'opacity': '1',
      // 'transform': ' translate3d(-50%, -82%, 0)',
      'transform': ' translate3d(-50%, -62%, 0)',
    })

    // 点击列表进行切歌
    $('ul', '.songList').on('click', function (e) {
      var event = e.target || e.srcElement;

      // 让歌曲列表滑到上次点歌的坐标
      e.offsetY = scroTop;

      // 判断点击到的事件源(歌曲)
      if (parseInt($(event).css('width')) > 10) {

        // 防止列表的某首歌多次点击触发多次播放
        if ($(event).parent().attr('data-index') != $('.list').attr('song-index')) {

          // 记录当前在列表点击的歌曲索引
          $('.list').attr('song-index', $(event).parent().attr('data-index'));

          // 暂停当前正在播放的音乐
          audio.pause();
          // 刷新左右切歌的索引,并将字符串用隐式类型转化转为数字
          currSongIndex = $('.list').attr('song-index')
          // control = new root.controlIndex(dataList.length, +currSongIndex);

          // 歌曲索引缓存到浏览器的cookie中
          saveCookie(currSongIndex);
          $('.curr-img').find('img').attr('src', '../image/bg.jpg')

          // 找到音频和图片
          root.rendering(dataList, $('.list').attr('song-index'));
          audio.getAudio(dataList[$('.list').attr('song-index')].audio);
          // 播放

          $('body').trigger('play-changer', $('.list').attr('song-index'));
          //记录当前的ul到屏幕的高度
          scroTop = e.offsetY;

          // 每次点击列表都会重绘ul所以不能在这里給li加active
          $('ul', '.songList').find('li').eq(currSongIndex).addClass('active');

          // $('.img-box').css({
          //   'left': 0,
          //   'transition': 'left .3s cubic-bezier(0, 0, 1, 1)'
          // });
          // rotate(0)
        }
      } else {
        // 点击到的是删除该歌曲
        alert('暂不支持，也别期待了.........')
      }
    })

    // 绑定关闭列表的遮罩层上事件
    $('.shadow').css({
      'display': 'block'
    }).on('click', function () {

      //将列表移到屏幕下方
      $('.list').find('.list-top').css({
        'transform': ' translate3d(-50%, 70%, 0)',
      });

      //等列表退回原位才取消列表的样式
      setTimeout(function () {
        $('.list').removeClass('playList');
      }, 300)
      $(this).css({
        'display': 'none'
      })
    })
  })
}

// 旋转
function rotate(deg) {
  var deg = Number(deg)
  cancelAnimationFrame(timer);
  $('.curr-img').attr('data-deg', deg.toFixed(1));
  $('.curr-img').find('div').css({
    'transform': 'translatez(0px) rotateZ(' + deg + 'deg)',
    'transition': "none 0s"
  })


  // 旋转值被记录到行间
  function frame() {
    deg += .2;

    $('.curr-img').attr('data-deg', deg.toFixed(1));
    $('.curr-img').find('div').css({
      'transform': 'translatez(0px) rotateZ(' + deg + 'deg)',
      'transition': 'transform .1s cubic-bezier(0, 0, 1, 1) '
    })
    timer = requestAnimationFrame(frame)
  }

  setTimeout(function () {
    frame();
  }, 500)

}

// 当前歌曲播放完毕自动切歌
audio.bindMediaEnd(function () {

  cancelAnimationFrame(timer);

  //默认下一首
  root.switch.imgClickMove($('.next-img'), $('.pro-img'), 'next-img', 'pro-img', 'moveIn-left', 'moveOut-left', '-142%', '132%')
  $('body').trigger('play-changer', control.next());
});


// 把当前的歌曲索引缓存到浏览器的cookie中
function saveCookie(currSongIndex) {
  document.cookie = 'song_index=' + currSongIndex + ';max-age=10000';
}

//获取cookie
function getCookie() {
  var cookie_str = document.cookie.match(/song_index=\d+/)[0]
  if (cookie_str != null) {
    currSongIndex = Number(cookie_str.replace(/\w+=/g, ''));

  } else {
    currSongIndex = 0;
  }
}


getCookie();
getData('../moke/data.json')