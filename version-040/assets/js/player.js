(function () {
    var panel = document.querySelector('[data-player]');
    if (!panel) {
        return;
    }

    var video = panel.querySelector('video');
    var cover = panel.querySelector('[data-play-button]');
    if (!video || !cover) {
        return;
    }

    var stream = video.getAttribute('data-stream') || '';
    var hls;
    var ready = false;

    function prepare() {
        if (ready || !stream) {
            return Promise.resolve();
        }
        ready = true;

        if (window.Hls && window.Hls.isSupported()) {
            hls = new window.Hls({
                enableWorker: true,
                lowLatencyMode: true,
                backBufferLength: 90
            });
            hls.loadSource(stream);
            hls.attachMedia(video);
            return new Promise(function (resolve) {
                hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
                    resolve();
                });
                window.setTimeout(resolve, 1200);
            });
        }

        video.src = stream;
        return Promise.resolve();
    }

    function showVideo() {
        cover.classList.add('is-hidden');
        video.setAttribute('controls', 'controls');
    }

    function play() {
        prepare().then(function () {
            showVideo();
            var attempt = video.play();
            if (attempt && typeof attempt.catch === 'function') {
                attempt.catch(function () {
                    showVideo();
                });
            }
        });
    }

    cover.addEventListener('click', play);
    video.addEventListener('click', function () {
        if (video.paused) {
            play();
        }
    });
    video.addEventListener('play', showVideo);
    window.addEventListener('beforeunload', function () {
        if (hls) {
            hls.destroy();
        }
    });
})();
