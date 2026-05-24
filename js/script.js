/* ============================================================
   ZOMATO CLONE — script.js
   Animations · Interactions · Dynamic UI
   ============================================================ */

(function () {
  "use strict";

  /* ── Data ─────────────────────────────────────────────────── */

  const RESTAURANTS = [
    { name: "Burger Barn",      emoji: "🍔", rating: "4.3", time: "25 min", tag: "Bestseller" },
    { name: "Spice Garden",     emoji: "🍛", rating: "4.6", time: "35 min", tag: "Top Rated"  },
    { name: "Pizza Paradiso",   emoji: "🍕", rating: "4.1", time: "30 min", tag: "New"        },
    { name: "Sushi Street",     emoji: "🍣", rating: "4.8", time: "45 min", tag: "Top Rated"  },
    { name: "Taco Fiesta",      emoji: "🌮", rating: "4.2", time: "20 min", tag: "Popular"    },
    { name: "The Biryani Co.",  emoji: "🍲", rating: "4.7", time: "40 min", tag: "Bestseller" },
    { name: "Wok & Roll",       emoji: "🍜", rating: "4.4", time: "28 min", tag: ""           },
    { name: "Dessert House",    emoji: "🍰", rating: "4.5", time: "15 min", tag: "Sweet Spot" },
  ];

  const SEARCH_SUGGESTIONS = [
    { icon: "🍕", text: "Pizza" },
    { icon: "🍔", text: "Burgers" },
    { icon: "🍛", text: "Biryani" },
    { icon: "🍣", text: "Sushi" },
    { icon: "🌮", text: "Tacos" },
    { icon: "🍜", text: "Noodles" },
    { icon: "🥗", text: "Salads" },
    { icon: "🍰", text: "Desserts" },
    { icon: "☕", text: "Café & Beverages" },
  ];

  /* ── DOM Build ─────────────────────────────────────────────── */

  function buildMain() {
    const main = document.querySelector("main");

    /* Hero */
    main.insertAdjacentHTML("beforeend", `
      <section class="hero">
        <h1 class="hero-title">
          Hungry? <span>We've got you</span><br>covered.
        </h1>
        <p class="hero-subtitle">
          Order from 10,000+ restaurants. Hot food delivered fast — right to your door.
        </p>
        <a class="hero-cta ripple-host" href="#">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 5h12"/><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/></svg>
          Order Now
        </a>
      </section>
    `);

    /* Offer Banner */
    main.insertAdjacentHTML("beforeend", `
      <div class="offer-banner" id="offerBanner">
        <div class="offer-text">
          <h3>🔥 Up to 60% OFF on your first order!</h3>
          <p>Use code <strong>ZOMFIRST</strong> at checkout. Limited time offer.</p>
        </div>
        <button class="offer-btn ripple-host" onclick="copyCode()">Copy Code</button>
      </div>
    `);

    /* Restaurant Cards */
    main.insertAdjacentHTML("beforeend", `
      <section class="section">
        <div class="section-header">
          <h2 class="section-title">Popular Near You</h2>
          <span class="section-sub">Updated just now</span>
        </div>
        <div class="card-grid" id="cardGrid"></div>
      </section>
    `);

    buildCards();
    wrapSearchWithSuggestions();
  }

  function buildCards() {
    const grid = document.getElementById("cardGrid");
    if (!grid) return;

    RESTAURANTS.forEach((r, i) => {
      const card = document.createElement("div");
      card.className = "card ripple-host";
      card.style.animationDelay = `${0.05 * i}s`;
      card.innerHTML = `
        <div class="card-img">${r.emoji}</div>
        <div class="card-body">
          <div class="card-name">${r.name}</div>
          <div class="card-info">
            <span class="badge">⭐ ${r.rating}</span>
            ${r.tag ? `<span class="badge red">${r.tag}</span>` : ""}
            <span>· ${r.time}</span>
          </div>
        </div>
      `;
      card.addEventListener("click", () => showToast(`Opening ${r.name}...`));
      card.addEventListener("click", rippleEffect);
      grid.appendChild(card);
    });
  }

  function wrapSearchWithSuggestions() {
    const searchInput = document.getElementById("search");
    if (!searchInput) return;

    /* Wrap in relative container */
    const wrapper = document.createElement("div");
    wrapper.className = "search-wrapper";
    searchInput.parentNode.insertBefore(wrapper, searchInput);
    wrapper.appendChild(searchInput);

    /* Suggestions dropdown */
    const dropdown = document.createElement("div");
    dropdown.id = "suggestions";
    SEARCH_SUGGESTIONS.forEach(s => {
      const item = document.createElement("div");
      item.className = "suggestion-item";
      item.innerHTML = `<span class="icon">${s.icon}</span>${s.text}`;
      item.addEventListener("mousedown", (e) => {
        e.preventDefault();
        searchInput.value = s.text;
        hideSuggestions();
        showToast(`Searching for "${s.text}"…`);
      });
      dropdown.appendChild(item);
    });
    wrapper.appendChild(dropdown);

    searchInput.addEventListener("focus", showSuggestions);
    searchInput.addEventListener("blur", () => setTimeout(hideSuggestions, 150));
    searchInput.addEventListener("input", filterSuggestions);
    searchInput.addEventListener("keydown", handleSearchKey);
  }

  function showSuggestions() {
    const dd = document.getElementById("suggestions");
    if (dd) dd.classList.add("active");
  }

  function hideSuggestions() {
    const dd = document.getElementById("suggestions");
    if (dd) dd.classList.remove("active");
  }

  function filterSuggestions(e) {
    const val = e.target.value.toLowerCase().trim();
    const dd = document.getElementById("suggestions");
    if (!dd) return;
    const items = dd.querySelectorAll(".suggestion-item");
    let anyVisible = false;
    items.forEach(item => {
      const matches = !val || item.textContent.toLowerCase().includes(val);
      item.style.display = matches ? "" : "none";
      if (matches) anyVisible = true;
    });
    dd.classList.toggle("active", anyVisible);
  }

  function handleSearchKey(e) {
    if (e.key === "Enter") {
      const val = e.target.value.trim();
      if (val) {
        hideSuggestions();
        showToast(`Searching for "${val}"…`);
      }
      e.preventDefault();
    }
    if (e.key === "Escape") hideSuggestions();
  }

  /* ── Location Change ───────────────────────────────────────── */

  function initLocation() {
    const sel = document.getElementById("location");
    if (!sel) return;
    sel.addEventListener("change", () => {
      if (sel.value) {
        showToast(`📍 Location set to ${sel.value}`);
        /* Animate section heading */
        const sub = document.querySelector(".section-sub");
        if (sub) {
          sub.textContent = `Near ${sel.value} · Updated just now`;
          sub.style.animation = "none";
          void sub.offsetWidth; // reflow
          sub.style.animation = "fadeUp 0.4s both";
        }
      }
    });
  }

  /* ── Toast ─────────────────────────────────────────────────── */

  let toastTimer = null;

  function showToast(msg) {
    let toast = document.getElementById("toast");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "toast";
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2800);
  }

  /* ── Copy Offer Code ───────────────────────────────────────── */

  window.copyCode = function () {
    const code = "ZOMFIRST";
    if (navigator.clipboard) {
      navigator.clipboard.writeText(code).then(() => showToast(`✅ Code "${code}" copied!`));
    } else {
      showToast(`Use code: ${code}`);
    }
  };

  /* ── Ripple Effect ─────────────────────────────────────────── */

  function rippleEffect(e) {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top  - size / 2;

    const ripple = document.createElement("span");
    ripple.className = "ripple";
    Object.assign(ripple.style, {
      width:  `${size}px`,
      height: `${size}px`,
      left:   `${x}px`,
      top:    `${y}px`,
    });
    el.appendChild(ripple);
    ripple.addEventListener("animationend", () => ripple.remove());
  }

  /* Attach ripple to hero CTA & offer btn via event delegation */
  document.addEventListener("click", (e) => {
    const host = e.target.closest(".ripple-host");
    if (host) rippleEffect(e);
  });

  /* ── Scroll-reveal for cards ───────────────────────────────── */

  function initScrollReveal() {
    if (!("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.style.animationPlayState = "running";
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    document.querySelectorAll(".card, .section-title, .hero-title, .hero-subtitle, .hero-cta").forEach(el => {
      el.style.animationPlayState = "paused";
      observer.observe(el);
    });
  }

  /* ── Header shadow on scroll ───────────────────────────────── */

  function initHeaderScroll() {
    const header = document.querySelector("header");
    if (!header) return;
    window.addEventListener("scroll", () => {
      header.style.boxShadow = window.scrollY > 10
        ? "0 4px 28px rgba(226,55,68,0.15)"
        : "0 2px 20px rgba(226,55,68,0.08)";
    }, { passive: true });
  }

  /* ── Offer banner enter animation ─────────────────────────── */

  function animateOfferBanner() {
    const banner = document.getElementById("offerBanner");
    if (!banner) return;
    banner.style.opacity = "0";
    banner.style.transform = "translateY(16px)";
    banner.style.transition = "opacity 0.6s 0.4s ease, transform 0.6s 0.4s ease";
    requestAnimationFrame(() => requestAnimationFrame(() => {
      banner.style.opacity = "1";
      banner.style.transform = "translateY(0)";
    }));
  }

  /* ── Typed placeholder on search ──────────────────────────── */

  function initTypedPlaceholder() {
    const input = document.getElementById("search");
    if (!input) return;

    const phrases = [
      "Search for biryani…",
      "Search for pizza near you…",
      "Search your favourite restaurant…",
      "Search for sushi…",
      "What are you craving today?",
    ];

    let pi = 0, ci = 0, deleting = false;
    let timer;

    function type() {
      if (document.activeElement === input) {
        timer = setTimeout(type, 1800);
        return;
      }
      const phrase = phrases[pi];
      if (!deleting) {
        ci++;
        input.placeholder = phrase.slice(0, ci);
        if (ci === phrase.length) {
          deleting = true;
          timer = setTimeout(type, 1800);
          return;
        }
        timer = setTimeout(type, 55);
      } else {
        ci--;
        input.placeholder = phrase.slice(0, ci);
        if (ci === 0) {
          deleting = false;
          pi = (pi + 1) % phrases.length;
          timer = setTimeout(type, 400);
          return;
        }
        timer = setTimeout(type, 30);
      }
    }
    timer = setTimeout(type, 1200);
  }

  /* ── Footer ────────────────────────────────────────────────── */

  function buildFooter() {
    const footer = document.querySelector("footer");
    if (!footer) return;
    const year = new Date().getFullYear();
    footer.innerHTML = `Copyright &copy; ${year} | All rights reserved to <strong>Zomato</strong>.`;
  }

  /* ── Init ───────────────────────────────────────────────────── */

  document.addEventListener("DOMContentLoaded", () => {
    buildMain();
    initLocation();
    initHeaderScroll();
    animateOfferBanner();
    initTypedPlaceholder();
    /* slight delay so DOM is painted before scroll-reveal attaches */
    requestAnimationFrame(initScrollReveal);
    buildFooter();
  });

})();
