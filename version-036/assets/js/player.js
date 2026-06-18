(function () {
  window.initMoviePlayer = function (video, overlay, button, source) {
    if (!video || !source) {
      return;
    }

    var loaded = false;
    var hlsInstance = null;

    function bindSource() {
      if (loaded) {
        return;
      }
      loaded = true;

      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = source;
      } else if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hlsInstance.loadSource(source);
        hlsInstance.attachMedia(video);
      } else {
        video.src = source;
      }
    }

    function beginPlayback() {
      bindSource();
      if (overlay) {
        overlay.classList.add("is-hidden");
      }
      var playTask = video.play();
      if (playTask && typeof playTask.catch === "function") {
        playTask.catch(function () {
          if (overlay) {
            overlay.classList.remove("is-hidden");
          }
        });
      }
    }

    var trigger = button || overlay;
    if (trigger) {
      trigger.addEventListener("click", beginPlayback);
    }
    if (overlay && overlay !== trigger) {
      overlay.addEventListener("click", beginPlayback);
    }
    video.addEventListener("click", function () {
      if (video.paused) {
        beginPlayback();
      }
    });
    video.addEventListener("play", function () {
      if (overlay) {
        overlay.classList.add("is-hidden");
      }
    });
    video.addEventListener("ended", function () {
      if (overlay) {
        overlay.classList.remove("is-hidden");
      }
    });
    window.addEventListener("beforeunload", function () {
      if (hlsInstance) {
        hlsInstance.destroy();
      }
    });
  };
}());
