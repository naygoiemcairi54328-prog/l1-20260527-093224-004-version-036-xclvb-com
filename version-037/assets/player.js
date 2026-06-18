(function () {
  function setupPlayer() {
    var video = document.querySelector('[data-hls-player]');
    var overlay = document.querySelector('[data-player-overlay]');
    if (!video || !overlay) {
      return;
    }

    var source = video.getAttribute('data-src');
    var started = false;

    function start() {
      if (started || !source) {
        return;
      }
      started = true;
      overlay.classList.add('hidden');

      if (window.Hls && window.Hls.isSupported()) {
        var hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: false
        });
        hls.loadSource(source);
        hls.attachMedia(video);
        hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
          video.play().catch(function () {});
        });
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = source;
        video.addEventListener('loadedmetadata', function () {
          video.play().catch(function () {});
        }, { once: true });
      } else {
        video.src = source;
        video.play().catch(function () {});
      }
    }

    overlay.addEventListener('click', start);
  }

  document.addEventListener('DOMContentLoaded', setupPlayer);
})();
