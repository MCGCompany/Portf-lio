/* ============================================
   CL · script.js
   ============================================ */

/* ---------- TRADUÇÕES ---------- */
const translations = {
  pt: {
    'meta.title': 'Christian Linhares — Fotografia',
    'meta.description': 'Fotografia de shows e esportes',
    'nav.index': 'Index',
    'nav.concerts': 'Shows',
    'nav.sports': 'Esportes',
    'nav.contact': 'Contato',
    'hero.signature': 'CL — Fotógrafo',
    'hero.based': 'RN, Brasil',
    'hero.status': 'Disponível',
    'hero.scroll': '↓ rolar',
    'chapter.cat': 'Categoria',
  },
  en: {
    'meta.title': 'Christian Linhares — Photography',
    'meta.description': 'Concert and sports photography',
    'nav.index': 'Index',
    'nav.concerts': 'Concerts',
    'nav.sports': 'Sports',
    'nav.contact': 'Contact',
    'hero.signature': 'CL — Photographer',
    'hero.based': 'RN, Brazil',
    'hero.status': 'Available',
    'hero.scroll': '↓ scroll',
    'chapter.cat': 'Category',
  },
};

function setLanguage(lang) {
  document.documentElement.lang = lang === 'pt' ? 'pt-BR' : 'en';
  localStorage.setItem('lang', lang);

  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    const value = translations[lang][key];
    if (value === undefined) return;

    if (el.tagName === 'TITLE') document.title = value;
    else if (el.tagName === 'META') el.setAttribute('content', value);
    else if (value.includes('<')) el.innerHTML = value;
    else el.textContent = value;
  });

  document.querySelectorAll('.lang-btn').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });
}

document.querySelectorAll('.lang-btn').forEach((btn) => {
  btn.addEventListener('click', () => setLanguage(btn.dataset.lang));
});

setLanguage(localStorage.getItem('lang') || 'pt');

/* ---------- LOADER ---------- */
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('hidden');
  }, 500);
});

/* ---------- ANO ---------- */
document.getElementById('year').textContent = new Date().getFullYear();

/* ---------- CUSTOM CURSOR ---------- */
const cursor = document.getElementById('cursor');
const isTouchDevice = window.matchMedia('(hover: none)').matches;

if (!isTouchDevice) {
  let mouseX = 0, mouseY = 0;
  let cursorX = 0, cursorY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animateCursor() {
    cursorX += (mouseX - cursorX) * 0.18;
    cursorY += (mouseY - cursorY) * 0.18;
    cursor.style.transform = `translate(${cursorX}px, ${cursorY}px) translate(-50%, -50%)`;
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  document.querySelectorAll('a, button, .lang-btn').forEach((el) => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
  });

  document.querySelectorAll('.masonry__item, .hero__portrait').forEach((el) => {
    el.addEventListener('mouseenter', () => cursor.classList.add('image'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('image'));
  });
}

/* ---------- MENU MOBILE ---------- */
const menuToggle = document.getElementById('menuToggle');
const nav = document.getElementById('nav');
menuToggle.addEventListener('click', () => nav.classList.toggle('open'));
nav.querySelectorAll('a').forEach((a) =>
  a.addEventListener('click', () => nav.classList.remove('open'))
);

/* ---------- SCROLL SPY ---------- */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav__link');

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach((link) => {
          link.classList.toggle('active', link.dataset.section === id);
        });
      }
    });
  },
  { rootMargin: '-40% 0px -55% 0px' }
);
sections.forEach((s) => observer.observe(s));

/* ---------- LIGHTBOX ---------- */
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxPrev = document.getElementById('lightboxPrev');
const lightboxNext = document.getElementById('lightboxNext');
const lightboxCounter = document.getElementById('lightboxCounter');

let currentGallery = [];
let currentIndex = 0;

document.querySelectorAll('.masonry').forEach((gallery) => {
  const items = gallery.querySelectorAll('.masonry__item');
  items.forEach((item, idx) => {
    item.addEventListener('click', () => {
      currentGallery = Array.from(items).map((c) => c.querySelector('img').src);
      currentIndex = idx;
      openLightbox();
    });
  });
});

function openLightbox() {
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
  updateLightbox();
}

function closeLightbox() {
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
}

function updateLightbox() {
  lightboxImg.src = currentGallery[currentIndex];
  lightboxCounter.textContent = `${String(currentIndex + 1).padStart(2, '0')} — ${String(currentGallery.length).padStart(2, '0')}`;
}

function navigate(dir) {
  currentIndex = (currentIndex + dir + currentGallery.length) % currentGallery.length;
  updateLightbox();
}

lightboxClose.addEventListener('click', closeLightbox);
lightboxPrev.addEventListener('click', () => navigate(-1));
lightboxNext.addEventListener('click', () => navigate(1));
lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox || e.target.classList.contains('lightbox__stage')) {
    closeLightbox();
  }
});

document.addEventListener('keydown', (e) => {
  if (!lightbox.classList.contains('active')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') navigate(-1);
  if (e.key === 'ArrowRight') navigate(1);
});

/* ---------- REVEAL ON SCROLL ---------- */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.05, rootMargin: '0px 0px -10% 0px' }
);

document.querySelectorAll('.masonry__item, .chapter__head, .contact__card').forEach((el, i) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = `opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${(i % 6) * 0.06}s, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${(i % 6) * 0.06}s`;
  revealObserver.observe(el);
});
