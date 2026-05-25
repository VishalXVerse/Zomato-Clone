/* ============================================================
   ZOMATO — script.js
   Features:
     1.  Loading screen
     2.  Sticky header with scroll class
     3.  DOM enhancement — food items (circular + label)
     4.  DOM enhancement — brand items (circular + label)
     5.  Restaurant cards — location-driven dynamic rendering
     6.  Intersection Observer — scroll reveal animations
     7.  Search live filter
     8.  Smooth section initialisation
   ============================================================ */

'use strict';

/* ============================================================
   ① DATA — Restaurant catalogue per city
   ============================================================ */

/** Colour swatches used to generate placeholder gradients */
const GRAD_PALETTES = [
  ['#FF6B6B', '#FFE66D'],
  ['#a18cd1', '#fbc2eb'],
  ['#ffecd2', '#fcb69f'],
  ['#a1c4fd', '#c2e9fb'],
  ['#fd7f6f', '#f9d423'],
  ['#43e97b', '#38f9d7'],
  ['#f093fb', '#f5576c'],
  ['#4facfe', '#00f2fe'],
  ['#fa709a', '#fee140'],
  ['#30cfd0', '#667eea'],
];

/** Returns a deterministic gradient for a given index */
const gradFor = (i) => GRAD_PALETTES[i % GRAD_PALETTES.length];

/**
 * Restaurant data keyed by location value (matches <select> options).
 * Each entry: { name, cuisine, discount, rating, mins, km }
 */
const RESTAURANT_DATA = {
  Bangalore: [
    { name: "Meghana Foods",       cuisine: "Biryani, North Indian",  discount: "50% off up to ₹100", rating: 4.3, mins: "25–30 min", km: "1.2 km" },
    { name: "CTR Shri Sagar",      cuisine: "South Indian",           discount: "Free delivery",       rating: 4.5, mins: "35–40 min", km: "2.1 km" },
    { name: "Empire Restaurant",   cuisine: "Kebabs, Rolls, Biryani", discount: "20% off on ₹299+",   rating: 4.1, mins: "20–25 min", km: "0.8 km" },
    { name: "Truffles",            cuisine: "Burgers, American",      discount: "30% off up to ₹120", rating: 4.6, mins: "30–35 min", km: "1.8 km" },
    { name: "Brahmin's Coffee Bar",cuisine: "Breakfast, South Indian",discount: "Free delivery",       rating: 4.4, mins: "40–45 min", km: "3.2 km" },
    { name: "Domino's Pizza",      cuisine: "Pizzas, Pastas",         discount: "2 Pizzas @ ₹599",    rating: 3.9, mins: "25–35 min", km: "1.0 km" },
    { name: "KFC",                 cuisine: "Burgers, Chicken",       discount: "15% off on app",      rating: 4.0, mins: "20–25 min", km: "0.6 km" },
    { name: "Vidyarthi Bhavan",    cuisine: "South Indian, Idli",     discount: "10% off on ₹200+",   rating: 4.7, mins: "45–50 min", km: "4.1 km" },
  ],
  Delhi: [
    { name: "Paranthe Wali Gali",  cuisine: "North Indian, Parathas", discount: "20% off on ₹249+",   rating: 4.4, mins: "30–40 min", km: "2.5 km" },
    { name: "Karim's",             cuisine: "Mughlai, Kebabs",        discount: "Free delivery",       rating: 4.6, mins: "35–45 min", km: "3.0 km" },
    { name: "Moti Mahal",          cuisine: "North Indian, Butter Chicken", discount: "25% off up to ₹150", rating: 4.2, mins: "28–35 min", km: "1.9 km" },
    { name: "Sagar Ratna",         cuisine: "South Indian",           discount: "15% off",             rating: 4.0, mins: "25–30 min", km: "1.1 km" },
    { name: "Haldiram's",          cuisine: "Sweets, Snacks, Thali",  discount: "Buy 2 Get 1 Free",    rating: 4.3, mins: "20–25 min", km: "0.9 km" },
    { name: "Pizza Hut",           cuisine: "Pizzas, Pasta",          discount: "BOGO on weekends",    rating: 3.8, mins: "30–40 min", km: "1.4 km" },
    { name: "Nathu's Sweets",      cuisine: "Sweets, Namkeen",        discount: "10% cashback",        rating: 4.5, mins: "35–40 min", km: "2.2 km" },
    { name: "Rolls Mania",         cuisine: "Rolls, Wraps, Frankies", discount: "40% off up to ₹80",  rating: 4.1, mins: "15–20 min", km: "0.5 km" },
  ],
  Patna: [
    { name: "Hotel Maurya",        cuisine: "North Indian, Thali",    discount: "20% off on ₹199+",   rating: 4.2, mins: "25–30 min", km: "1.3 km" },
    { name: "Kundan Confectionary",cuisine: "Sweets, Bakery",         discount: "Free delivery",       rating: 4.5, mins: "30–35 min", km: "1.8 km" },
    { name: "Bihari Tadka",        cuisine: "Bihari, Litti Chokha",   discount: "10% cashback",        rating: 4.4, mins: "20–25 min", km: "0.7 km" },
    { name: "Domino's Pizza",      cuisine: "Pizzas, Garlic Bread",   discount: "2 Pizzas @ ₹499",    rating: 3.9, mins: "25–35 min", km: "1.0 km" },
    { name: "Hotel Chanakya",      cuisine: "Multi-cuisine, Buffet",  discount: "25% off on ₹399+",   rating: 4.1, mins: "35–40 min", km: "2.5 km" },
    { name: "Kanha Sweets",        cuisine: "Sweets, Chaat",          discount: "Buy 1 Get 1 Free",    rating: 4.3, mins: "18–22 min", km: "0.5 km" },
    { name: "The Yellow Chilli",   cuisine: "North Indian, Punjabi",  discount: "30% off up to ₹130", rating: 4.0, mins: "28–35 min", km: "1.6 km" },
    { name: "Pizza Hut",           cuisine: "Pizzas, Pasta",          discount: "50% off on 1st order",rating: 3.8, mins: "30–40 min", km: "2.0 km" },
  ],
  Gandhinagar: [
    { name: "Honest Restaurant",   cuisine: "Gujarati, Thali",        discount: "20% off on ₹199+",   rating: 4.5, mins: "25–30 min", km: "1.1 km" },
    { name: "Agashiye",            cuisine: "Gujarati Cuisine",       discount: "Free delivery",       rating: 4.7, mins: "40–50 min", km: "3.2 km" },
    { name: "Gordhan Thal",        cuisine: "Gujarati, Rajasthani",   discount: "15% cashback",        rating: 4.3, mins: "30–35 min", km: "1.9 km" },
    { name: "Pizza Hut",           cuisine: "Pizzas, Pasta",          discount: "BOGO on weekends",    rating: 3.9, mins: "25–30 min", km: "0.8 km" },
    { name: "KFC",                 cuisine: "Burgers, Fried Chicken", discount: "10% off on app",      rating: 4.0, mins: "20–25 min", km: "0.6 km" },
    { name: "Swad Restaurant",     cuisine: "North Indian, Chinese",  discount: "30% off up to ₹120", rating: 4.1, mins: "22–28 min", km: "1.0 km" },
  ],
  Gurgaon: [
    { name: "Punjab Grill",        cuisine: "North Indian, Punjabi",  discount: "25% off on ₹299+",   rating: 4.4, mins: "30–35 min", km: "1.7 km" },
    { name: "Andhra Bhavan",       cuisine: "South Indian, Andhra",   discount: "Free delivery",       rating: 4.6, mins: "35–40 min", km: "2.4 km" },
    { name: "Wow! Momo",           cuisine: "Momos, Rolls",           discount: "20% off on ₹249+",   rating: 4.1, mins: "20–25 min", km: "0.8 km" },
    { name: "McDonald's",          cuisine: "Burgers, Fries",         discount: "McSaver @ ₹99",       rating: 4.0, mins: "18–22 min", km: "0.5 km" },
    { name: "Social",              cuisine: "Continental, Bar",       discount: "Happy Hours 4–7 PM",  rating: 4.3, mins: "30–40 min", km: "2.1 km" },
    { name: "Barbeque Nation",     cuisine: "BBQ, North Indian",      discount: "Kids free under 5",   rating: 4.5, mins: "40–50 min", km: "3.0 km" },
    { name: "La Pino'z Pizza",     cuisine: "Pizzas, Pasta",          discount: "40% off 1st order",   rating: 3.8, mins: "25–30 min", km: "1.2 km" },
  ],
  Kolkata: [
    { name: "Peter Cat",           cuisine: "Continental, Mughlai",   discount: "20% off on ₹399+",   rating: 4.5, mins: "35–45 min", km: "2.8 km" },
    { name: "Mocambo",             cuisine: "Continental, Kebabs",    discount: "Free dessert on ₹500",rating: 4.6, mins: "40–50 min", km: "3.5 km" },
    { name: "Arsalan",             cuisine: "Biryani, Mughlai",       discount: "50% off up to ₹100", rating: 4.4, mins: "30–35 min", km: "2.0 km" },
    { name: "Tibetan Delight",     cuisine: "Momos, Tibetan",         discount: "10% cashback",        rating: 4.2, mins: "20–25 min", km: "1.0 km" },
    { name: "Flurys",              cuisine: "Bakery, Cafe, Desserts", discount: "15% off on cakes",    rating: 4.5, mins: "25–30 min", km: "1.5 km" },
    { name: "KFC",                 cuisine: "Burgers, Fried Chicken", discount: "Bucket @ ₹499",       rating: 3.9, mins: "20–28 min", km: "0.7 km" },
    { name: "Domino's Pizza",      cuisine: "Pizzas, Pasta",          discount: "2 Mediums @ ₹449",   rating: 3.8, mins: "28–35 min", km: "1.3 km" },
  ],
  Lakhisarai: [
    { name: "Shri Krishna Bhojnalaya", cuisine: "Bihari Thali, Dal Bati", discount: "Free delivery",  rating: 4.2, mins: "15–20 min", km: "0.4 km" },
    { name: "Mithu Sweets",        cuisine: "Sweets, Namkeen",        discount: "10% off on ₹199+",   rating: 4.4, mins: "12–18 min", km: "0.3 km" },
    { name: "Hotel Raj",           cuisine: "North Indian, Rice",     discount: "20% cashback",        rating: 3.9, mins: "20–25 min", km: "0.8 km" },
    { name: "Chandan Dhaba",       cuisine: "Dhaba-style, Chicken",   discount: "Combo meal @ ₹149",  rating: 4.1, mins: "18–22 min", km: "0.6 km" },
  ],
};

/* ============================================================
   ② LOADING SCREEN
   ============================================================ */

/**
 * Injects a loading overlay into the DOM and removes it once
 * the page has finished loading.
 */
function initLoadingScreen() {
  const screen = document.createElement('div');
  screen.id = 'loading-screen';
  screen.innerHTML = `
    <div class="loader-brand">zomato</div>
    <div class="loader-tagline">Discover · Order · Enjoy</div>
    <div class="loader-track"><div class="loader-fill"></div></div>
  `;
  document.body.prepend(screen);

  // Remove screen after animation + small buffer
  const dismiss = () => {
    screen.classList.add('fade-out');
    // Remove from DOM after transition finishes
    screen.addEventListener('transitionend', () => screen.remove(), { once: true });
  };

  if (document.readyState === 'complete') {
    setTimeout(dismiss, 1700);
  } else {
    window.addEventListener('load', () => setTimeout(dismiss, 800));
  }
}

/* ============================================================
   ③ STICKY HEADER — scroll class
   ============================================================ */

function initStickyHeader() {
  const header = document.querySelector('header');
  if (!header) return;

  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
  };

  // Throttle to ~60fps
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => { onScroll(); ticking = false; });
      ticking = true;
    }
  }, { passive: true });

  onScroll(); // run once on init
}

/* ============================================================
   ④ SECTION CLASSIFICATION
   Adds meaningful class names to each section for CSS targeting.
   ============================================================ */

function classifySections() {
  const sections = document.querySelectorAll('main > section');
  const names = ['food-section', 'brands-section', 'restaurants-section', 'explore-section'];
  sections.forEach((sec, i) => {
    if (names[i]) sec.classList.add(names[i]);
  });
}

/* ============================================================
   ⑤ FOOD ITEMS — enhance li > img into circular components
   ============================================================ */

function initFoodItems() {
  const section = document.querySelector('.food-section');
  if (!section) return;

  const ul = section.querySelector('ul');
  if (!ul) return;

  // Move the h1 outside the ul (it's semantically wrong inside ul)
  const heading = ul.querySelector('h1');
  if (heading) {
    heading.classList.add('section-heading');
    section.insertBefore(heading, ul);
  }

  ul.classList.add('food-items-grid', 'stagger-children');

  // Transform each li > img into a rich food-item component
  ul.querySelectorAll('li').forEach((li) => {
    const img = li.querySelector('img');
    if (!img) return;

    const label = img.alt || '';
    li.classList.add('food-item');

    // Wrap image in styled ring
    const ring = document.createElement('div');
    ring.className = 'food-img-ring';
    ring.appendChild(img);

    // Label text
    const span = document.createElement('span');
    span.className = 'food-label';
    span.textContent = label;

    li.innerHTML = '';
    li.appendChild(ring);
    li.appendChild(span);

    // Ripple effect on click
    li.addEventListener('click', (e) => createRipple(e, li));
  });
}

/* ============================================================
   ⑥ BRAND ITEMS — same treatment as food items
   ============================================================ */

function initBrandItems() {
  const section = document.querySelector('.brands-section');
  if (!section) return;

  // Wrap content in a constrained inner div
  const inner = document.createElement('div');
  inner.className = 'brands-inner';
  while (section.firstChild) inner.appendChild(section.firstChild);
  section.appendChild(inner);

  const ul = inner.querySelector('ul');
  if (!ul) return;

  const heading = ul.querySelector('h2');
  if (heading) {
    heading.classList.add('section-heading');
    inner.insertBefore(heading, ul);
  }

  ul.classList.add('brands-grid', 'stagger-children');

  ul.querySelectorAll('li').forEach((li) => {
    const img = li.querySelector('img');
    if (!img) return;

    const label = img.alt || '';
    li.classList.add('brand-item');

    const ring = document.createElement('div');
    ring.className = 'brand-img-ring';
    ring.appendChild(img);

    const span = document.createElement('span');
    span.className = 'brand-label';
    span.textContent = label;

    li.innerHTML = '';
    li.appendChild(ring);
    li.appendChild(span);

    li.addEventListener('click', (e) => createRipple(e, li));
  });
}

/* ============================================================
   ⑦ EXPLORE SECTION — structural cleanup
   ============================================================ */

function initExploreSection() {
  const section = document.querySelector('.explore-section');
  if (!section) return;

  // Wrap everything in a constrained inner div
  const inner = document.createElement('div');
  inner.className = 'explore-inner';
  while (section.firstChild) inner.appendChild(section.firstChild);
  section.appendChild(inner);

  // Style the eyebrow <p>
  const eyebrow = inner.querySelector('p');
  if (eyebrow) eyebrow.classList.add('explore-eyebrow');
}

/* ============================================================
   ⑧ RESTAURANT CARDS — dynamic generation
   ============================================================ */

/**
 * Creates and returns a single restaurant card element.
 * @param {Object} data  — restaurant object from RESTAURANT_DATA
 * @param {number} index — position for gradient selection
 */
function createRestaurantCard(data, index) {
  const [c1, c2] = gradFor(index);
  const card = document.createElement('div');
  card.className = 'restaurant-card reveal';

  card.innerHTML = `
    <div class="card-img-wrap">
      <div
        class="card-img-gradient"
        style="
          width:100%; height:100%;
          background: linear-gradient(135deg, ${c1}, ${c2});
          display:flex; align-items:center; justify-content:center;
          font-size: 2.8rem;
        "
      >${foodEmoji(data.cuisine)}</div>
      <div class="discount-badge">${data.discount}</div>
    </div>
    <div class="card-body">
      <div class="card-name">${data.name}</div>
      <div class="card-meta">
        <span class="rating-tag">
          <svg viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
          ${data.rating}
        </span>
        <span class="dot"></span>
        <span class="card-time">${data.mins}</span>
        <span class="dot"></span>
        <span class="card-dist">${data.km}</span>
      </div>
      <div class="card-cuisine">${data.cuisine}</div>
    </div>
  `;

  // Hover glow on card — subtle red border tint
  card.addEventListener('mouseenter', () => {
    card.style.setProperty('--card-glow', c1);
  });

  return card;
}

/**
 * Returns a food emoji that loosely matches the cuisine string.
 */
function foodEmoji(cuisine = '') {
  const c = cuisine.toLowerCase();
  if (c.includes('pizza'))   return '🍕';
  if (c.includes('biryani')) return '🍛';
  if (c.includes('burger'))  return '🍔';
  if (c.includes('momo') || c.includes('tibetan')) return '🥟';
  if (c.includes('south') || c.includes('dosa'))   return '🥘';
  if (c.includes('sweet') || c.includes('dessert')) return '🍮';
  if (c.includes('chicken') || c.includes('kebab')) return '🍗';
  if (c.includes('roll') || c.includes('wrap'))     return '🌯';
  if (c.includes('thali') || c.includes('gujarati')) return '🍱';
  if (c.includes('bakery') || c.includes('cafe'))   return '☕';
  if (c.includes('chinese') || c.includes('noodle')) return '🍜';
  if (c.includes('bbq') || c.includes('grill'))     return '🔥';
  return '🍽️';
}

/**
 * Renders skeleton placeholders while "loading".
 */
function renderSkeletons(grid, count = 4) {
  grid.innerHTML = '';
  for (let i = 0; i < count; i++) {
    const skel = document.createElement('div');
    skel.className = 'restaurant-card';
    skel.innerHTML = `
      <div class="skeleton" style="height:160px;border-radius:var(--r-md) var(--r-md) 0 0;"></div>
      <div class="card-body" style="gap:10px;">
        <div class="skeleton" style="height:18px;width:70%;border-radius:4px;"></div>
        <div class="skeleton" style="height:14px;width:50%;border-radius:4px;"></div>
        <div class="skeleton" style="height:12px;width:40%;border-radius:4px;"></div>
      </div>
    `;
    grid.appendChild(skel);
  }
}

/**
 * Renders restaurant cards for the given location value.
 * Shows a brief skeleton delay to feel "real".
 */
function renderRestaurants(locationValue) {
  const grid = document.getElementById('restaurants-grid');
  const heading = document.querySelector('.restaurants-section h3');
  if (!grid) return;

  // Update heading
  if (heading) {
    const display = heading.querySelector('#location-name-display') ||
      (() => {
        const em = document.createElement('em');
        em.id = 'location-name-display';
        heading.textContent = '';
        heading.appendChild(document.createTextNode(''));
        heading.appendChild(em);
        return em;
      })();
    heading.childNodes[0].textContent = locationValue ? `${locationValue} ` : '';
    display.textContent = locationValue ? 'Restaurants' : 'Location Restaurants';
  }

  if (!locationValue) {
    grid.innerHTML = `
      <div class="no-location">
        <div class="nl-icon">📍</div>
        <p>Select your location to see restaurants</p>
        <small>Use the dropdown in the header</small>
      </div>
    `;
    return;
  }

  const restaurants = RESTAURANT_DATA[locationValue];
  if (!restaurants || restaurants.length === 0) {
    grid.innerHTML = `
      <div class="no-location">
        <div class="nl-icon">🍽️</div>
        <p>No restaurants found for <strong>${locationValue}</strong></p>
        <small>Try selecting a different location</small>
      </div>
    `;
    return;
  }

  // Skeleton loading feel
  renderSkeletons(grid, Math.min(restaurants.length, 4));

  setTimeout(() => {
    grid.innerHTML = '';

    restaurants.forEach((data, i) => {
      const card = createRestaurantCard(data, i);
      // Stagger card entrance
      card.style.transitionDelay = `${i * 0.06}s`;
      grid.appendChild(card);

      // Trigger reveal in next frame
      requestAnimationFrame(() => {
        requestAnimationFrame(() => card.classList.add('in-view'));
      });
    });
  }, 550); // simulate API delay
}

/**
 * Wires up the location <select> to re-render restaurants on change.
 */
function initRestaurantSection() {
  const section = document.querySelector('.restaurants-section');
  if (!section) return;

  // Create the grid container if it doesn't exist
  let grid = document.getElementById('restaurants-grid');
  if (!grid) {
    grid = document.createElement('div');
    grid.id = 'restaurants-grid';
    section.appendChild(grid);
  }

  // Initial render (no location selected yet)
  renderRestaurants(null);

  // Listen for location change
  const select = document.getElementById('place');
  if (select) {
    select.addEventListener('change', (e) => {
      renderRestaurants(e.target.value || null);
    });
  }
}

/* ============================================================
   ⑨ INTERSECTION OBSERVER — scroll-reveal animations
   ============================================================ */

function initScrollReveal() {
  const options = {
    root:       null,
    rootMargin: '0px 0px -60px 0px',
    threshold:  0.12,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        // Unobserve after triggered (one-shot)
        observer.unobserve(entry.target);
      }
    });
  }, options);

  // Elements with reveal classes
  document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale')
    .forEach((el) => observer.observe(el));

  // Stagger containers
  document.querySelectorAll('.stagger-children')
    .forEach((el) => observer.observe(el));
}

/* ============================================================
   ⑩ REVEAL CLASS ASSIGNMENT — add reveal classes to sections
   ============================================================ */

function assignRevealClasses() {
  // Section headings
  document.querySelectorAll('.section-heading, .restaurants-section h3')
    .forEach((el) => el.classList.add('reveal'));

  // Explore section headings + pill lists
  document.querySelectorAll('.explore-section h4, .explore-section h5, .explore-section h6')
    .forEach((el) => el.classList.add('reveal'));

  document.querySelectorAll('.explore-section ul')
    .forEach((el) => el.classList.add('reveal'));

  // Footer columns
  document.querySelectorAll('footer > div:nth-child(2) > ul')
    .forEach((el, i) => {
      el.classList.add(i % 2 === 0 ? 'reveal-left' : 'reveal-right');
    });

  document.querySelector('footer > div:last-child')
    ?.classList.add('reveal');
}

/* ============================================================
   ⑪ SEARCH — live filter for restaurant cards
   ============================================================ */

function initSearch() {
  const searchInput = document.getElementById('search');
  if (!searchInput) return;

  let debounceTimer;

  searchInput.addEventListener('input', (e) => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      const query = e.target.value.toLowerCase().trim();
      filterRestaurants(query);
    }, 250);
  });

  // Clear on Escape
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      searchInput.value = '';
      filterRestaurants('');
    }
  });
}

/**
 * Shows/hides restaurant cards based on the search query.
 * Matches against name and cuisine fields.
 */
function filterRestaurants(query) {
  const grid = document.getElementById('restaurants-grid');
  if (!grid) return;

  const cards = grid.querySelectorAll('.restaurant-card');
  if (!cards.length) return;

  cards.forEach((card) => {
    const name    = card.querySelector('.card-name')?.textContent.toLowerCase() || '';
    const cuisine = card.querySelector('.card-cuisine')?.textContent.toLowerCase() || '';
    const matches = !query || name.includes(query) || cuisine.includes(query);

    card.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
    card.style.opacity    = matches ? '1' : '0.2';
    card.style.transform  = matches ? '' : 'scale(0.97)';
    card.style.pointerEvents = matches ? '' : 'none';
  });
}

/* ============================================================
   ⑫ RIPPLE EFFECT UTILITY
   ============================================================ */

/**
 * Creates a Material-style ripple on any element.
 * @param {MouseEvent} e
 * @param {HTMLElement} el
 */
function createRipple(e, el) {
  const existing = el.querySelector('.ripple');
  if (existing) existing.remove();

  const rect   = el.getBoundingClientRect();
  const size   = Math.max(rect.width, rect.height);
  const x      = e.clientX - rect.left - size / 2;
  const y      = e.clientY - rect.top  - size / 2;

  const ripple = document.createElement('span');
  ripple.className = 'ripple';
  Object.assign(ripple.style, {
    position:     'absolute',
    width:        `${size}px`,
    height:       `${size}px`,
    left:         `${x}px`,
    top:          `${y}px`,
    background:   'rgba(226, 55, 68, 0.18)',
    borderRadius: '50%',
    transform:    'scale(0)',
    animation:    'ripple-anim 0.5s ease-out forwards',
    pointerEvents:'none',
  });

  el.style.position = 'relative';
  el.style.overflow = 'hidden';
  el.appendChild(ripple);

  ripple.addEventListener('animationend', () => ripple.remove());
}

// Inject ripple keyframes once
(function injectRippleKeyframes() {
  if (document.getElementById('ripple-kf')) return;
  const style = document.createElement('style');
  style.id = 'ripple-kf';
  style.textContent = `
    @keyframes ripple-anim {
      to { transform: scale(2.5); opacity: 0; }
    }
  `;
  document.head.appendChild(style);
})();

/* ============================================================
   ⑬ SMOOTH SCROLLING (belt-and-suspenders for older browsers)
   ============================================================ */

function initSmoothScrollLinks() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

/* ============================================================
   ⑭ HEADER — location selector animated indicator
   ============================================================ */

function initLocationIndicator() {
  const select = document.getElementById('place');
  const li = select?.closest('li');
  if (!li || !select) return;

  // Add the header-location class for styling
  li.classList.add('header-location');

  select.addEventListener('change', () => {
    // Brief pulse on location change
    li.style.transition = 'transform 0.2s ease';
    li.style.transform  = 'scale(1.05)';
    setTimeout(() => { li.style.transform = ''; }, 200);
  });
}

/* ============================================================
   ⑮ MAIN INIT — runs when DOM is ready
   ============================================================ */

function init() {
  initLoadingScreen();
  classifySections();
  initStickyHeader();
  initFoodItems();
  initBrandItems();
  initExploreSection();
  initRestaurantSection();
  initSearch();
  initLocationIndicator();
  initSmoothScrollLinks();

  // Assign reveal classes BEFORE initialising observer
  assignRevealClasses();

  // Small delay so elements are in DOM and positioned before observing
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      initScrollReveal();
    });
  });
}

/* ---- Kickoff ---- */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}