(function () {
  function onReady(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  function setupHeader() {
    var header = document.querySelector("[data-header]");
    var toggle = document.querySelector("[data-menu-toggle]");
    var menu = document.querySelector("[data-mobile-menu]");

    function syncHeader() {
      if (!header) {
        return;
      }
      if (window.scrollY > 18) {
        header.classList.add("is-scrolled");
      } else {
        header.classList.remove("is-scrolled");
      }
    }

    if (toggle && menu) {
      toggle.addEventListener("click", function () {
        menu.classList.toggle("is-open");
      });
    }

    window.addEventListener("scroll", syncHeader, { passive: true });
    syncHeader();
  }

  function setupHeroSlider() {
    var sliders = document.querySelectorAll("[data-hero-slider]");

    sliders.forEach(function (slider) {
      var slides = Array.prototype.slice.call(slider.querySelectorAll("[data-hero-slide]"));
      var dots = Array.prototype.slice.call(slider.querySelectorAll("[data-hero-dot]"));
      var prev = slider.querySelector("[data-hero-prev]");
      var next = slider.querySelector("[data-hero-next]");
      var index = 0;
      var timer = null;

      if (!slides.length) {
        return;
      }

      function show(nextIndex) {
        index = (nextIndex + slides.length) % slides.length;
        slides.forEach(function (slide, slideIndex) {
          slide.classList.toggle("is-active", slideIndex === index);
        });
        dots.forEach(function (dot, dotIndex) {
          dot.classList.toggle("is-active", dotIndex === index);
        });
      }

      function start() {
        stop();
        timer = window.setInterval(function () {
          show(index + 1);
        }, 5200);
      }

      function stop() {
        if (timer) {
          window.clearInterval(timer);
          timer = null;
        }
      }

      if (prev) {
        prev.addEventListener("click", function () {
          show(index - 1);
          start();
        });
      }

      if (next) {
        next.addEventListener("click", function () {
          show(index + 1);
          start();
        });
      }

      dots.forEach(function (dot, dotIndex) {
        dot.addEventListener("click", function () {
          show(dotIndex);
          start();
        });
      });

      slider.addEventListener("mouseenter", stop);
      slider.addEventListener("mouseleave", start);
      show(0);
      start();
    });
  }

  function normalize(value) {
    return String(value || "").toLowerCase().replace(/\s+/g, "");
  }

  function setupFilters() {
    var searchInputs = Array.prototype.slice.call(document.querySelectorAll("[data-movie-search]"));

    searchInputs.forEach(function (input) {
      var section = input.closest("section") || document;
      var select = section.querySelector("[data-category-filter]");
      var empty = section.querySelector("[data-empty-state]");
      var cards = Array.prototype.slice.call(section.querySelectorAll("[data-movie-card]"));

      function applyFilter() {
        var query = normalize(input.value);
        var category = select ? normalize(select.value) : "";
        var visibleCount = 0;

        cards.forEach(function (card) {
          var content = normalize([
            card.dataset.title,
            card.dataset.region,
            card.dataset.genre,
            card.dataset.type,
            card.dataset.category,
            card.dataset.tags
          ].join(" "));
          var matchesQuery = !query || content.indexOf(query) !== -1;
          var matchesCategory = !category || normalize(card.dataset.category) === category;
          var visible = matchesQuery && matchesCategory;
          card.classList.toggle("is-filtered-out", !visible);
          if (visible) {
            visibleCount += 1;
          }
        });

        if (empty) {
          empty.classList.toggle("is-visible", visibleCount === 0);
        }
      }

      input.addEventListener("input", applyFilter);
      if (select) {
        select.addEventListener("change", applyFilter);
      }
      applyFilter();
    });
  }

  onReady(function () {
    setupHeader();
    setupHeroSlider();
    setupFilters();
  });
}());
