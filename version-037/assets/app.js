(function () {
  function normalize(value) {
    return (value || '').toString().trim().toLowerCase();
  }

  function setupMobileMenu() {
    var button = document.querySelector('[data-menu-button]');
    var panel = document.querySelector('[data-mobile-panel]');
    if (!button || !panel) {
      return;
    }
    button.addEventListener('click', function () {
      panel.classList.toggle('open');
    });
  }

  function setupHeroSlider() {
    var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
    if (!slides.length) {
      return;
    }
    var active = 0;
    function show(index) {
      active = (index + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('active', i === active);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('active', i === active);
      });
    }
    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        show(i);
      });
    });
    show(0);
    window.setInterval(function () {
      show(active + 1);
    }, 5200);
  }

  function setupFilters() {
    var cards = Array.prototype.slice.call(document.querySelectorAll('[data-movie-card]'));
    var input = document.querySelector('[data-search-input]');
    var count = document.querySelector('[data-filter-count]');
    var clear = document.querySelector('[data-clear-filter]');
    var empty = document.querySelector('[data-empty-state]');
    var yearButtons = Array.prototype.slice.call(document.querySelectorAll('[data-year-filter]'));
    var typeButtons = Array.prototype.slice.call(document.querySelectorAll('[data-type-filter]'));
    if (!cards.length) {
      return;
    }

    var params = new URLSearchParams(window.location.search);
    var state = {
      q: params.get('q') || '',
      year: '',
      type: ''
    };

    if (input && state.q) {
      input.value = state.q;
    }

    function apply() {
      var q = normalize(state.q);
      var year = normalize(state.year);
      var type = normalize(state.type);
      var visible = 0;

      cards.forEach(function (card) {
        var text = normalize(card.getAttribute('data-search'));
        var cardYear = normalize(card.getAttribute('data-year'));
        var cardType = normalize(card.getAttribute('data-type'));
        var matched = true;

        if (q && text.indexOf(q) === -1) {
          matched = false;
        }
        if (year && cardYear !== year) {
          matched = false;
        }
        if (type && cardType !== type) {
          matched = false;
        }

        card.style.display = matched ? '' : 'none';
        if (matched) {
          visible += 1;
        }
      });

      if (count) {
        count.textContent = '当前显示 ' + visible + ' 部影片 / 共 ' + cards.length + ' 部';
      }
      if (empty) {
        empty.classList.toggle('show', visible === 0);
      }
      yearButtons.forEach(function (button) {
        button.classList.toggle('active', normalize(button.getAttribute('data-year-filter')) === year);
      });
      typeButtons.forEach(function (button) {
        button.classList.toggle('active', normalize(button.getAttribute('data-type-filter')) === type);
      });
    }

    if (input) {
      input.addEventListener('input', function () {
        state.q = input.value;
        apply();
      });
    }
    if (clear) {
      clear.addEventListener('click', function () {
        state.q = '';
        state.year = '';
        state.type = '';
        if (input) {
          input.value = '';
        }
        apply();
      });
    }
    yearButtons.forEach(function (button) {
      button.addEventListener('click', function () {
        state.year = button.getAttribute('data-year-filter') || '';
        apply();
      });
    });
    typeButtons.forEach(function (button) {
      button.addEventListener('click', function () {
        state.type = button.getAttribute('data-type-filter') || '';
        apply();
      });
    });

    apply();
  }

  document.addEventListener('DOMContentLoaded', function () {
    setupMobileMenu();
    setupHeroSlider();
    setupFilters();
  });
})();
