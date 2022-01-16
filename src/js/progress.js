(function ($, root) {
  var frameId;
  var lastPercent = 0;

  var time = 0; //当前歌曲已播放的时间
  var secondTime;
  var startTime;
  //将小于1小时的00:00:00时间格式转换为00:00形式
  function renderTotalTime(totalTime) {

    // 记录当前展示的歌曲的总时长的秒数时间
    conversonSecondTime(totalTime)
    var regHou = /^\d+/g;
    if (totalTime.match(regHou)[0] == 0 && totalTime.length > 4) {
      var regRemovrHou = /^\d+:/g;
      var allTime = totalTime.replace(regRemovrHou, function ($) {
        return $ = '';
      })
      $('.all-time').text(allTime);
    } else {

      $('.all-time').text(totalTime);
    };
  }

  //将00:00:00形式的时间转换为秒的时间
  function conversonSecondTime(data) {

    var time = data.duration || data;

    var regHou = /^\d+/g;
    var regMin = /:\d+:/g;
    var regSec = /\d+$/g;
    var hours = +time.match(regHou)[0];
    var minute = +time.match(regMin)[0].split(':')[1];
    var second = +time.match(regSec)[0];
    secondTime = hours * 3600 + minute * 60 + second;
    return secondTime;
  }


  // 将一个时间秒转换为00:00:00形式
  function renderPlayTime(time) {
    var str, hours, minute, second;

    if (time > 3600) {
      var num = parseInt(parseInt(time / 3600));
      hours = num >= 10 ? num + ':' : '0' + num + ':';
      minute = (time - num * 3600) / 60 >= 10 ? parseInt((time - num * 3600) / 60) + ':' : '0' + parseInt((time - num * 3600) / 60) + ':';
    } else {
      hours = parseInt(time / 3600) > 0 ? (parseInt(time / 3600) >= 10 ? (parseInt(time / 3600) + ':') : ('0' + parseInt(time / 3600) + ':')) : '';
      minute = parseInt(time / 60) >= 10 ? (parseInt(time % 3600) >= 59 ? (parseInt(parseInt(time % 3600) / 60) + ':') : (parseInt(time / 60) + ':')) : ('0' + parseInt(time / 60) + ':');
    }

    second = parseInt(time % 60) >= 10 ? parseInt(time % 60) : '0' + parseInt(time % 60);


    str = hours + minute + second;
    $('.cur-time').html(str).css({
      'line-height': '38px'
    }) //修改样式是点击播放有颤动

  }

  function updata(percent) {

    // 渲染当前已播放的时间
    renderPlayTime(secondTime * percent);

    var percentage = percent * 100
    $('.pro-top').css({
      'transform ': 'translate3d(' + percentage + '%, 0px, 0px)'
    });


    //有自动切歌的话就不需要这个判断，会冲突。
    // if (percentage == 100) {
    //     stop();
    //     $('.play').removeClass('playing');

    //     lock--;
    //     percentage = 0;
    // }
  }

  // 时间和进度条的改变
  function start(data, pro, lock) {

    //每次切歌都将歌曲上次持续播放的时长置0,pro为拖拽进度条的已播放时长 lock点击暂停的情况
    lastPercent = lock ? lastPercent : pro || 0;

    cancelAnimationFrame(frameId);
    // 记录当前点击播放的时刻 
    startTime = new Date().getTime();
    var percent;

    function frame() {

      var currTime = new Date().getTime();
      time = (currTime - startTime) / 1000;
      percent = lastPercent + (time / conversonSecondTime(data));
      frameId = requestAnimationFrame(frame);
      updata(percent);
    }
    frame()
  }

  function stop() {

    //记录当前暂停播放的时刻
    var stopTime = new Date().getTime();

    //歌曲上次持续播放的时长 = 上次暂停 + 上次开始 + 当前暂停
    lastPercent += ((stopTime - startTime) / secondTime / 1000);

    cancelAnimationFrame(frameId);
  }

  root.progress = {
    renderTotalTime: renderTotalTime,
    start: start,
    stop: stop,
    updata: updata,
    conversonSecondTime: conversonSecondTime,
  }

})(window.Zepto, window.player || (window.player = {}))