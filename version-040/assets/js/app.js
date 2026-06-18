(function () {
    function all(selector, parent) {
        return Array.prototype.slice.call((parent || document).querySelectorAll(selector));
    }

    function toggleHidden(element) {
        if (!element) {
            return;
        }
        element.hidden = !element.hidden;
    }

    var navButton = document.querySelector('[data-nav-toggle]');
    var mobileNav = document.querySelector('[data-mobile-nav]');
    if (navButton && mobileNav) {
        navButton.addEventListener('click', function () {
            toggleHidden(mobileNav);
        });
    }

    var searchButton = document.querySelector('[data-search-toggle]');
    var headerSearch = document.querySelector('[data-header-search]');
    if (searchButton && headerSearch) {
        searchButton.addEventListener('click', function () {
            toggleHidden(headerSearch);
            var input = headerSearch.querySelector('input');
            if (!headerSearch.hidden && input) {
                input.focus();
            }
        });
    }

    all('[data-hero]').forEach(function (slider) {
        var slides = all('.hero-slide', slider);
        var dots = all('.hero-dot', slider);
        var index = 0;
        var timer;

        function show(next) {
            if (!slides.length) {
                return;
            }
            index = (next + slides.length) % slides.length;
            slides.forEach(function (slide, i) {
                slide.classList.toggle('active', i === index);
            });
            dots.forEach(function (dot, i) {
                dot.classList.toggle('active', i === index);
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
            }
        }

        dots.forEach(function (dot, i) {
            dot.addEventListener('click', function () {
                show(i);
                start();
            });
        });

        slider.addEventListener('mouseenter', stop);
        slider.addEventListener('mouseleave', start);
        show(0);
        start();
    });

    all('[data-filter-scope]').forEach(function (scope) {
        var input = scope.querySelector('[data-search-input]');
        var typeSelect = scope.querySelector('[data-type-filter]');
        var yearSelect = scope.querySelector('[data-year-filter]');
        var resetButton = scope.querySelector('[data-reset-filter]');
        var cards = all('[data-movie-card]', scope);
        var empty = scope.querySelector('[data-empty-message]');

        function valueOf(element) {
            return element ? String(element.value || '').trim().toLowerCase() : '';
        }

        function apply() {
            var query = valueOf(input);
            var type = valueOf(typeSelect);
            var year = valueOf(yearSelect);
            var visible = 0;

            cards.forEach(function (card) {
                var haystack = card.getAttribute('data-search') || '';
                var cardType = card.getAttribute('data-type') || '';
                var cardYear = card.getAttribute('data-year') || '';
                var matched = true;

                if (query && haystack.indexOf(query) === -1) {
                    matched = false;
                }
                if (type && cardType !== type) {
                    matched = false;
                }
                if (year && cardYear !== year) {
                    matched = false;
                }

                card.classList.toggle('hidden-card', !matched);
                if (matched) {
                    visible += 1;
                }
            });

            if (empty) {
                empty.classList.toggle('active', visible === 0);
            }
        }

        [input, typeSelect, yearSelect].forEach(function (element) {
            if (element) {
                element.addEventListener('input', apply);
                element.addEventListener('change', apply);
            }
        });

        if (resetButton) {
            resetButton.addEventListener('click', function () {
                if (input) {
                    input.value = '';
                }
                if (typeSelect) {
                    typeSelect.value = '';
                }
                if (yearSelect) {
                    yearSelect.value = '';
                }
                apply();
            });
        }

        var params = new URLSearchParams(window.location.search);
        var q = params.get('q');
        if (q && input) {
            input.value = q;
        }
        apply();
    });
})();
