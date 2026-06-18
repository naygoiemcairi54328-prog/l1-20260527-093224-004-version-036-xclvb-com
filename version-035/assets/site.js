(function() {
  var menuButton = document.querySelector('.menu-button');
  var mobileNav = document.querySelector('.mobile-nav');
  if (menuButton && mobileNav) {
    menuButton.addEventListener('click', function() {
      mobileNav.classList.toggle('open');
    });
  }

  document.querySelectorAll('img').forEach(function(img) {
    img.addEventListener('error', function() {
      img.classList.add('image-missing');
    });
  });

  var slides = Array.prototype.slice.call(document.querySelectorAll('.hero-slide'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('.hero-dot'));
  var current = 0;
  function showSlide(index) {
    if (!slides.length) {
      return;
    }
    current = (index + slides.length) % slides.length;
    slides.forEach(function(slide, i) {
      slide.classList.toggle('active', i === current);
    });
    dots.forEach(function(dot, i) {
      dot.classList.toggle('active', i === current);
    });
  }
  dots.forEach(function(dot, i) {
    dot.addEventListener('click', function() {
      showSlide(i);
    });
  });
  if (slides.length > 1) {
    setInterval(function() {
      showSlide(current + 1);
    }, 5200);
  }

  document.querySelectorAll('[data-filter-scope]').forEach(function(scope) {
    var input = scope.querySelector('[data-filter-input]');
    var kind = scope.querySelector('[data-kind-filter]');
    var year = scope.querySelector('[data-year-filter]');
    var cards = Array.prototype.slice.call(scope.querySelectorAll('[data-search]'));
    function applyFilter() {
      var q = input ? input.value.trim().toLowerCase() : '';
      var selectedKind = kind ? kind.value : '';
      var selectedYear = year ? year.value : '';
      cards.forEach(function(card) {
        var text = (card.getAttribute('data-search') || '').toLowerCase();
        var ok = true;
        if (q && text.indexOf(q) === -1) {
          ok = false;
        }
        if (selectedKind && card.getAttribute('data-kind') !== selectedKind) {
          ok = false;
        }
        if (selectedYear && card.getAttribute('data-year') !== selectedYear) {
          ok = false;
        }
        card.style.display = ok ? '' : 'none';
      });
    }
    [input, kind, year].forEach(function(el) {
      if (el) {
        el.addEventListener('input', applyFilter);
        el.addEventListener('change', applyFilter);
      }
    });
  });

  document.querySelectorAll('.player-box').forEach(function(box) {
    var video = box.querySelector('video');
    var source = video ? video.querySelector('source') : null;
    var trigger = box.querySelector('.play-trigger');
    var hlsInstance = null;
    function playVideo() {
      if (!video || !source) {
        return;
      }
      var src = source.getAttribute('src');
      box.classList.add('is-playing');
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        if (!video.getAttribute('src')) {
          video.setAttribute('src', src);
        }
        video.play().catch(function() {});
        return;
      }
      if (window.Hls && window.Hls.isSupported()) {
        if (!hlsInstance) {
          hlsInstance = new Hls();
          hlsInstance.attachMedia(video);
          hlsInstance.on(Hls.Events.MEDIA_ATTACHED, function() {
            hlsInstance.loadSource(src);
            video.play().catch(function() {});
          });
        } else {
          video.play().catch(function() {});
        }
        return;
      }
      video.setAttribute('src', src);
      video.play().catch(function() {});
    }
    if (trigger) {
      trigger.addEventListener('click', playVideo);
    }
    if (video) {
      video.addEventListener('click', function() {
        if (video.paused) {
          playVideo();
        }
      });
    }
  });
})();
