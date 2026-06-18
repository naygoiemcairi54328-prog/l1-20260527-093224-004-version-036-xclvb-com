(function () {
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  function initNavigation() {
    var button = document.querySelector(".menu-toggle");
    var nav = document.getElementById("mobileNav");
    if (!button || !nav) {
      return;
    }
    button.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      button.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  function initHero() {
    var slides = Array.prototype.slice.call(document.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(document.querySelectorAll(".hero-dot"));
    if (!slides.length) {
      return;
    }
    var index = 0;
    var timer = null;
    function show(next) {
      index = (next + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle("active", i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle("active", i === index);
      });
    }
    function start() {
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5200);
    }
    dots.forEach(function (dot, i) {
      dot.addEventListener("click", function () {
        if (timer) {
          window.clearInterval(timer);
        }
        show(i);
        start();
      });
    });
    show(0);
    start();
  }

  function initFilters() {
    var scopes = Array.prototype.slice.call(document.querySelectorAll(".filter-scope"));
    scopes.forEach(function (scope) {
      var input = scope.querySelector("#searchInput");
      var year = scope.querySelector("#yearFilter");
      var type = scope.querySelector("#typeFilter");
      var cards = Array.prototype.slice.call(scope.querySelectorAll(".movie-card, .rank-row"));
      var empty = scope.querySelector(".empty-state");
      if (!cards.length || (!input && !year && !type)) {
        return;
      }
      function value(el) {
        return el ? el.value.trim().toLowerCase() : "";
      }
      function filter() {
        var q = value(input);
        var y = value(year);
        var t = value(type);
        var visible = 0;
        cards.forEach(function (card) {
          var haystack = [
            card.getAttribute("data-title"),
            card.getAttribute("data-genre"),
            card.getAttribute("data-region"),
            card.getAttribute("data-type"),
            card.getAttribute("data-year"),
            card.getAttribute("data-text")
          ].join(" ").toLowerCase();
          var ok = true;
          if (q && haystack.indexOf(q) === -1) {
            ok = false;
          }
          if (y && String(card.getAttribute("data-year") || "").toLowerCase() !== y) {
            ok = false;
          }
          if (t && String(card.getAttribute("data-type") || "").toLowerCase() !== t) {
            ok = false;
          }
          card.hidden = !ok;
          if (ok) {
            visible += 1;
          }
        });
        if (empty) {
          empty.hidden = visible !== 0;
        }
      }
      [input, year, type].forEach(function (el) {
        if (el) {
          el.addEventListener("input", filter);
          el.addEventListener("change", filter);
        }
      });
      var params = new URLSearchParams(window.location.search);
      var q = params.get("q");
      if (q && input) {
        input.value = q;
        filter();
      }
    });
  }

  function initBackTop() {
    var button = document.querySelector(".back-top");
    if (!button) {
      return;
    }
    function update() {
      button.classList.toggle("show", window.scrollY > 500);
    }
    button.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
    window.addEventListener("scroll", update, { passive: true });
    update();
  }

  window.initMoviePlayer = function (streamUrl) {
    function bind() {
      var video = document.getElementById("movieVideo");
      var overlay = document.getElementById("playerOverlay");
      var player = null;
      var attached = false;
      if (!video || !overlay || !streamUrl) {
        return;
      }
      function attach() {
        if (attached) {
          return;
        }
        attached = true;
        if (video.canPlayType("application/vnd.apple.mpegurl")) {
          video.src = streamUrl;
        } else if (typeof Hls !== "undefined" && Hls.isSupported()) {
          player = new Hls({ enableWorker: true, lowLatencyMode: true });
          player.loadSource(streamUrl);
          player.attachMedia(video);
        } else {
          video.src = streamUrl;
        }
      }
      function play() {
        attach();
        overlay.classList.add("hidden");
        video.controls = true;
        var action = video.play();
        if (action && typeof action.catch === "function") {
          action.catch(function () {});
        }
      }
      overlay.addEventListener("click", play);
      video.addEventListener("click", function () {
        if (!attached) {
          play();
        }
      });
      window.addEventListener("beforeunload", function () {
        if (player && typeof player.destroy === "function") {
          player.destroy();
        }
      });
    }
    ready(bind);
  };

  ready(function () {
    initNavigation();
    initHero();
    initFilters();
    initBackTop();
  });
})();
