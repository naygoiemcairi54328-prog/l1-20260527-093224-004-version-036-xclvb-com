import { H as Hls } from "./hlsjs-dru42stk.js";

const ready = (callback) => {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", callback);
  } else {
    callback();
  }
};

const normalize = (value) => String(value || "").trim().toLowerCase();

function initMenu() {
  const toggle = document.querySelector("[data-menu-toggle]");
  const nav = document.querySelector("[data-mobile-nav]");
  if (!toggle || !nav) {
    return;
  }

  toggle.addEventListener("click", () => {
    nav.classList.toggle("open");
  });
}

function initHero() {
  const hero = document.querySelector("[data-hero]");
  if (!hero) {
    return;
  }

  const slides = Array.from(hero.querySelectorAll("[data-hero-slide]"));
  const dots = Array.from(hero.querySelectorAll("[data-hero-dot]"));
  if (slides.length <= 1) {
    return;
  }

  let current = 0;
  let timer = null;

  const show = (index) => {
    current = (index + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => {
      slide.classList.toggle("active", slideIndex === current);
    });
    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle("active", dotIndex === current);
    });
  };

  const start = () => {
    stop();
    timer = window.setInterval(() => show(current + 1), 5200);
  };

  const stop = () => {
    if (timer) {
      window.clearInterval(timer);
      timer = null;
    }
  };

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      show(index);
      start();
    });
  });

  hero.addEventListener("mouseenter", stop);
  hero.addEventListener("mouseleave", start);
  show(0);
  start();
}

function initSearchAndFilters() {
  document.querySelectorAll("[data-search-scope]").forEach((scope) => {
    const searchInput = scope.querySelector("[data-search-input]");
    const filterFields = Array.from(scope.querySelectorAll("[data-filter-field]"));
    const cards = Array.from(scope.querySelectorAll("[data-movie-card]"));
    const resultCount = scope.querySelector("[data-result-count]");

    const apply = () => {
      const query = normalize(searchInput ? searchInput.value : "");
      const filters = Object.fromEntries(
        filterFields.map((field) => [field.dataset.filterField, normalize(field.value)])
      );
      let visible = 0;

      cards.forEach((card) => {
        const searchText = normalize(card.dataset.search);
        const matchesQuery = !query || searchText.includes(query);
        const matchesFilters = Object.entries(filters).every(([key, value]) => {
          if (!value) {
            return true;
          }
          return normalize(card.dataset[key]) === value;
        });
        const shouldShow = matchesQuery && matchesFilters;
        card.dataset.hiddenByFilter = shouldShow ? "false" : "true";
        if (shouldShow) {
          visible += 1;
        }
      });

      if (resultCount) {
        resultCount.textContent = `${visible} 部影片`;
      }
    };

    if (searchInput) {
      searchInput.addEventListener("input", apply);
    }
    filterFields.forEach((field) => field.addEventListener("change", apply));
    apply();
  });
}

function initPlayers() {
  document.querySelectorAll("[data-player]").forEach((box) => {
    const video = box.querySelector("video");
    const button = box.querySelector("[data-play-button]");
    const source = box.dataset.videoSrc;

    if (!video || !button) {
      return;
    }

    const play = async () => {
      if (!source) {
        button.querySelector("em").textContent = "当前影片没有可用播放源。";
        return;
      }

      try {
        if (Hls && Hls.isSupported()) {
          const hls = new Hls({
            enableWorker: true,
            lowLatencyMode: true
          });
          hls.loadSource(source);
          hls.attachMedia(video);
        } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
          video.src = source;
        } else {
          window.open(source, "_blank", "noopener");
          return;
        }

        video.controls = true;
        box.classList.add("playing");
        await video.play();
      } catch (error) {
        box.classList.remove("playing");
        button.querySelector("em").textContent = "播放器初始化失败，请稍后重试。";
        console.error("HLS 播放失败", error);
      }
    };

    button.addEventListener("click", play, { once: true });
  });
}

ready(() => {
  initMenu();
  initHero();
  initSearchAndFilters();
  initPlayers();
});
