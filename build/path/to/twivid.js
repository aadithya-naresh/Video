var socket = io.connect('http://localhost:4000',{transports: ['websocket', 'polling', 'flashsocket']});


var jQueryPlugin = (window.jQueryPlugin = function (ident, func) {
    return function (arg) {
    if (this.length > 1) {
        this.each(function () {
        var $this = $(this);

        if (!$this.data(ident)) {
            $this.data(ident, func($this, arg));
        }
        });

        return this;
    } else if (this.length === 1) {
        if (!this.data(ident)) {
        this.data(ident, func(this, arg));
        }

        return this.data(ident);
    }
    };
});

  (function () {
    function twitterVideoPlayer($root) {
      const element = $root;
      const video = $root.first(".video");
      const video_element = $root.find("video");
      const video_preview = $root.find(".video-preview");
      const video_top = $root.find(".video-top");
      const video_start_btn = $root.find(".video-start-btn");
      const video_control_btn = $root.find(".video-control-btn");
      const video_control_play = $root.find(".video-control-play");
      const video_control_pause = $root.find(".video-control-pause");
      const video_voice = $root.find(".video-voice");
      const video_voice_btn = $root.find(".video-voice-btn");
      const video_voice_on = $root.find(".video-voice-on");
      const video_voice_off = $root.find(".video-voice-off");
      const full_screen_btn = $root.find(".full-screen-btn");
      const full_screen_open = $root.find(".full-screen-open");
      const full_screen_exit = $root.find(".full-screen-exit");
      const video_voice_slider = $root.find(".video-voice-slider-range");
      const video_voice_rail = $root.find(".video-voice-slider-rail");
      const video_voice_buffer = $root.find(".video-voice-slider-buffer");
      const video_slider = $root.find(".video-slider-container");
      const video_slider_rail = $root.find(".video-slider-rail");
      const video_slider_buffered = $root.find(".video-slider-buffered");
      const video_slider_buffer = $root.find(".video-slider-buffer");
      const video_slider_tooltip = $root.find(".video-slider-tooltip");
      const video_count_time = $root.find(".video-count-time");
      const video_count_fulltime = $root.find(".video-count-fulltime");
      const video_loading = $root.find(".video-loading");
      const video_reset = $root.find(".video-reset");
      const video_reset_btn = $root.find(".video-reset-btn");
      const video_contextMenu = $root.find(".video-contextMenu");

      const video_playback_rate = $root.find(".video-playback-rate");
      const video_playback_speed = $root.find(".video-playback-speed");
      const video_playback_box = $root.find(".video-playback-box");

      var url = [
        "https://res.cloudinary.com/earthy/video/upload/v1605796874/vikram_720_lx1c12.mp4",
        "https://res.cloudinary.com/earthy/video/upload/v1605805534/vikram_360_ukp2g4.mp4",
        "https://res.cloudinary.com/earthy/video/upload/v1605805426/vikram_144_kjnow8.mp4"
        ]
        
      function capture() {
        var canvas = document.getElementById('canvas');
        canvas.width = $("video").width();
        canvas.height = $("video").height();
        canvas.getContext('2d').drawImage(vid, 0, 0, $("video").width(),$("video").height());
        var dataURL = canvas.toDataURL();console.log(dataURL)
        return dataURL;
      }
      function showq(){
        $(".anim").addClass("anime");
        setTimeout( function(){$(".anim").removeClass("anime"); }, 600);
      }

      var vid = $(video_element).get(0);
      function ch(src){
        $(".anim-img").attr("src" , "/static-img/"+src);
        // console.log($(".anim-img").get(0),src)
      }
      $('.video').hover(hov,ohov);
      var tio = null;
      $(".video").mousemove(hov);
      function hov(){
        if(tio != null){clearTimeout(tio);}
        $('.video-slider').css({marginBottom:"-7px"});
        $('.row').css({transform:"translateY(0px)"});
        if($(window).width()<800){
          $('.video-slider').css({marginBottom:"-58px"});
        }
        tio = setTimeout( ohov , 3000);
      }
      function ohov(){
        if(vid.paused){return;}
        $('.row').css({transform:"translateY(58px)"});
        $('.video-slider').css({marginBottom:"-58px"});
        
      }
      socket.on('play',function(){
        $(video_preview).hide();
        console.log("socket play running..");
        play(1);
        showq();
      })
      socket.on('pause',function(){
        pause(1);
        console.log("socket pause running..");
        showq();
      })
      function play(k=0) {
        console.log('calling play');
        if(k == 0)
          socket.emit('play',{});
        ch("play.png");
        vid.play();
        video_control_play.hide();
        video_control_pause.show();
      }
      function pause(k=0) {
        if(k == 0 && !video.ended)
          socket.emit('pause',{});
        ch("pause.png");
        hov();
        vid.pause();
        video_control_pause.hide();
        video_control_play.show();
      }
      function loading() {
        if (vid.readyState >= 3 ) {
          video_loading.hide();
          // play();
          // $(".video")
          if(qualch){
            play();qualch = false;
          }
        } else {
          if(!cur_click){
            video_loading.show();
          }
          if(qualch){
            pause();
          }
        }
      }
      $(".video_player_controls").hover(hov);
      $(document).keydown(function(e){
        if(e.which == '32'){if(vid.paused){play();}else{pause();}showq();}
        if(e.which == '37'){replay(5.5);socket.emit('rf',{sk:'-'})}
        if(e.which == '39'){forward(5.5);socket.emit('rf',{sk:'+'})}
      })
      socket.on('rf',function(data){
        if(data.sk == '-'){
          replay(5.5);
        }
        else{
          forward(5.5);
        }
      })
      function replay(time){
        vid.currentTime -= 5.5;ch('replay5.png');showq();
      }
      function forward(time){
        vid.currentTime += 5.5;ch('forward5.png');showq();
      }
      $(vid).on("progress", function () {
        loading();
      });
      function voiceOn() {
        vid.muted = true;
        $(video_voice_on).hide();
        $(video_voice_off).show();
      }
      function voiceOff() {
        vid.muted = false;
        $(video_voice_on).show();
        $(video_voice_off).hide();
      }
      function Fullscreen(element) {
        if (element.requestFullscreen) element.requestFullscreen();
        else if (element.mozRequestFullScreen) element.mozRequestFullScreen();
        else if (element.webkitRequestFullscreen)
          element.webkitRequestFullscreen();
        else if (element.msRequestFullscreen) element.msRequestFullscreen();
        full_screen_open.hide();
        full_screen_exit.show();
      }
      function exitFullscreen() {
        if (document.exitFullscreen) document.exitFullscreen();
        else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
        else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
        else if (document.msExitFullscreen) document.msExitFullscreen();
        full_screen_open.show();
        full_screen_exit.hide();
      }
      function IsFullScreen() {
        var full_screen_element =
          document.fullscreenElement ||
          document.webkitFullscreenElement ||
          document.mozFullScreenElement ||
          document.msFullscreenElement ||
          null;
  
        if (full_screen_element === null) return false;
        else return true;
      }
      function updateplayer() {
        loading();if(qualch){return}
        var percentage = (vid.currentTime / vid.duration) * 100;
        if(vid.buffered.length>0){
          // console.log('running...');
          var per = (vid.buffered.end(0)/vid.duration)*100;
          video_slider_buffered.css({width:per+1 +"%"});
        
        }
        if(vid.duration-vid.currentTime>1){
          video_reset.css("display", "none");
        }
        video_slider_rail.css({ width: percentage + "%" });
        
        video_slider_buffer.css({ left: percentage - 1 + "%" });

        video_count_time.text(getFormatedTime(vid.currentTime));
        video_count_fulltime.text(getFormatedTime(vid.duration));
      }
      socket.on('skip',function(data){
        skip(data.cur);
      }) 
      function skip(cur = 0) {
        if(cur == 0){
          var mouseX = event.pageX - video_slider.offset().left,
            width = video_slider.outerWidth();
          vid.currentTime = (mouseX / width) * vid.duration;
          socket.emit('skip',{cur:vid.currentTime});
        }
        else{
          vid.currentTime = cur;
        }
        updateplayer();
      }

      function getFormatedTime(k) {
        var seconds = Math.round(k);
        var minutes = Math.floor(seconds / 60);
  
        if (minutes > 0) {
          seconds -= minutes * 60;
        }
        if (seconds.toString().length === 1) {
          seconds = "0" + seconds;
        }
        if (minutes.toString().length === 1) {
          minutes = "0" + minutes;
        }
        return minutes + ":" + seconds;
      }
      
      video_slider.mousemove(tooltip);

      function tooltip() {
        var mouseX = event.pageX - video_slider.offset().left,
        width = video_slider.outerWidth();
        var cur = (mouseX / width) * vid.duration;
        if(cur<0||cur>vid.duration){
            return;
        }
        video_slider_tooltip.html(getFormatedTime(cur));
        video_slider_tooltip.css({left:Math.min(mouseX,video_slider.width()-video_slider_tooltip.width()-10)});
        // console.log(mouseX,video_slider_tooltip.width());
        video_slider_tooltip.show();
      }
      
      video_slider.hover(function(){},function(){video_slider_tooltip.hide()});

      video_start_btn.click(function () {
        $(video_preview).hide();
        play();
      });
      
      video_control_btn.click(function () {
        if (vid.paused) {
          play();
        } else {
          pause();
        }
        return false;
      });
      video_top.click(function () {
        if (vid.paused) {
          play();
        } else {
          pause();
        }
        showq();
        return false;
      });
      video_voice_btn.click(function () {

        if (vid.muted === false) {
          voiceOn();
        } else {
          voiceOff();
        }
      });
      full_screen_btn.click(function () {
        if (IsFullScreen()) exitFullscreen();
        else Fullscreen(video[0]);
      });
      video_top.dblclick(function () {
        if (IsFullScreen()) exitFullscreen();
        else Fullscreen(video[0]);
      });

      video_voice_slider.on("input change", function () {
        var range = (localStorage[this.id] = $(this).val());
        video_voice_buffer.css("width", range * 100 + "%");
        vid.volume = range;
        video_voice_slider.attr("value", range);
        if (range == 0) {
          voiceOn();
        } else {
          voiceOff();
        }
      });
      video_voice_slider.each(function () {
        if (typeof localStorage[this.id] !== "undefined") {
          $(this).val(localStorage[this.id]);
        }
      });
      video_voice_slider.keyup(function () {
          var range = (localStorage[this.id] = $(this).val());
          video_voice_buffer.css("width", range * 100 + "%");
          vid.volume = range;
          video_voice_slider.attr("value", range);
          if (range == 0) {
            voiceOn();
          } else {
            voiceOff();
          }
        })
        .keyup();

      video_slider.click(function () {
        skip();
      });

      updateplayer();
      if(vid.buffered.length>0){
        video_count_fulltime.text(getFormatedTime(vid.duration));
      }

      var qualch = false;
      $(vid).on("timeupdate", function () {
          updateplayer();
      });

      $(video_slider_buffer).on("input change", function () {
        updateplayer();
      });

      var cur_click = false;
      $(video_slider_buffer).on("mousedown", function () {
        cur_click = true;
      });

      $(document).on("mousemove", function () {
        if(cur_click == true){
          tooltip();
          skip();
        }
      });
      $(document).on("mouseup", function () {
        
        cur_click = false;
        
        video_slider_tooltip.hide();
        updateplayer();
      });
      video_voice.hover(
        function () {
          video_slider.hide();
        },
        function () {
          video_slider.show();
        }
      );
      video_playback_rate.hover(
        function () {
          video_playback_box.show();
          video_slider.hide();
        },
        function () {
          video_playback_box.hide();
          video_slider.show();
        }
      );
      const video_playback = $root.find(".video-playback");

      video_playback.click(function(){
        
          try{
            vid.playbackRate = parseFloat($(this).text());
            video_playback_speed.text($(this).text()+"x");
          }
          catch(err){
            console.log(err);
            console.log('running');
            vid.playbackRate = 1;video_playback_speed.text("Normal");  
          }
        
      });
      
      const video_pixel_rate = $root.find(".video-pixel-rate");
      const video_pixel_speed = $root.find(".video-pixel-speed");
      const video_pixel_box = $root.find(".video-pixel-box");
      const video_pixel = $root.find(".video-pixel");
      video_pixel.click(function(){
          var t = $(this).text()
          if(t == video_pixel_speed.text()){return;}
          // console.log(t == "High");
          // var u = capture();
          // $(".video").css({backgroundImage:u});
          var ele = $("#vid");
          if(t=="High"){
            ele.attr("src",url[0]);
          }else if(t == "Medium"){ele.attr("src",url[1]);}else{ele.attr("src",url[2]);}
          var cur = vid.currentTime;
          var plrt = vid.playbackRate;
          qualch = true;
          video_pixel_speed.text($(this).text());
          vid.load();
          
          vid.currentTime = cur;
          vid.playbackRate = plrt;
          
      });
      const video_pip = $root.find(".video-pip");
      if ('pictureInPictureEnabled' in document) {
        // video_pip.disabled = false;
      
        video_pip.on('click', () => {
          vid
            .requestPictureInPicture()
            .catch(error => {
             console.log(error)
            });
        });
      }
      $(vid).on("pause",function(){pause();})
      $(vid).on("play",function(){play();})
    
      video_pixel_rate.hover(
        function () {
          video_pixel_box.show();
          video_slider.hide();
        },
        function () {
          video_pixel_box.hide();
          video_slider.show();
        }
      );
      socket.on('end',function(){
        if(vid.ended){}
        else{
          vid.currentTime = vid.duration;
          updateplayer();
          ended = true;
        }
      })
      var ended = false;
      $(vid).on("ended", function () {
        video_reset.css("display", "flex");
        if(!ended){
          socket.emit('end',{});
        }
        else{ended = false;}
      });
      video_reset_btn.click(function () {
        play();
        video_reset.css("display", "none");
      });
      
    }
  
    $.fn.twitterVideoPlayer = jQueryPlugin(
      "twitterVideoPlayer",
      twitterVideoPlayer
    );
  })();
  
  $(".video").twitterVideoPlayer();

$(".video-start-btn").click(function (){
    console.log($(window).width(),$(window).height());
});