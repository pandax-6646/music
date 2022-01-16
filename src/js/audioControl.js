(function ($, root) {
  // 播放 暂停 获取音频不播放
  function AudioManager() {

    //创建一个audio对象
    this.audio = new Audio();

    // audio默认状态
    this.status = 'pause';
  }
  AudioManager.prototype = {
    play: function () {
      this.audio.play();
      this.status = 'play';
    },

    
    pause: function () {
      this.audio.pause();
      this.status = 'pause';
    },

    playTo: function (pro) {
      // console.log(this)
      this.audio.currentTime = pro;
      this.play();
    },

    getAudio: function (src) {
      this.audio.src = src;
      this.audio.load();
    },
    bindMediaEnd: function (handle) {
      this.audio.onended = handle;
    }

  }
  root.audioManager = new AudioManager();

})(window.Zepto, window.player || (window.player = {}))