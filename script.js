/**
 * Ganpati Bappa Invitation — script.js
 * ─ Curtain-reveal splash
 * ─ Sticky top-bar show/hide
 * ─ IntersectionObserver scroll reveal
 * ─ Touch/mouse swipe carousel with auto-play
 */

/* ═══════════════════════════════════════
   EASILY EDITABLE CONTENT VARIABLES
═══════════════════════════════════════ */
const CONTENT = {
  familyName:   'घोले परिवार',
  hostName:     'श्री. निनाद घोले',
  hostPhone:    '+919999999999',
  hostCity:     'पुणे, महाराष्ट्र',
  mapsLink:     'https://maps.google.com/?q=Pune+Maharashtra',
  year:         '२०२६',

  events: [
    { label:'उपआयोजन', title:'सत्यनारायण पूजा',      date:'१६ ऑगस्ट २०२६',     times:['🌆 सायंकाळी ६:००'] },
    { label:'दिवस १',  title:'प्राणप्रतिष्ठा',         date:'१४ सप्टेंबर २०२६',  times:['🌅 सकाळी ८:००'] },
    { label:'दि. १४–२१', title:'आरती व पूजन',          date:'दररोज',              times:['🌅 सकाळी ८:००', '🌆 सायंकाळी ७:३०'] },
    { label:'दररोज',  title:'अथर्वशीर्ष पठण',         date:'१४ – २१ सप्टेंबर', times:['🌅 सकाळी ९:००'] },
    { label:'विशेष',   title:'महाप्रसाद',              date:'रविवार, २० सप्टेंबर',times:['🌆 सायंकाळी ८:००'] },
    { label:'अंतिम',   title:'विसर्जन',               date:'२१ सप्टेंबर २०२६',  times:['🌅 सकाळी १०:००'] },
  ],
};

/* ═══════════════════════════════════════
   INIT
═══════════════════════════════════════ */
(function () {
  'use strict';

  const splash     = document.getElementById('splash');
  const splashBtn  = document.getElementById('splash-btn');
  const main       = document.getElementById('main');
  const topbar     = document.getElementById('topbar');
  const btnMaps    = document.getElementById('btn-maps');
  const btnCall    = document.getElementById('btn-call');

  // Patch live content from variables
  if (btnMaps) btnMaps.href = CONTENT.mapsLink;
  if (btnCall) btnCall.href = 'tel:' + CONTENT.hostPhone;

  /* ── Body locked on load ── */
  document.body.classList.add('splash-open');

  /* ──────────────────────────────────────
     SPLASH DISMISS
  ────────────────────────────────────── */
  function dismissSplash() {
    splash.classList.add('gone');
    document.body.classList.remove('splash-open');
    main.classList.remove('main-hidden');
    main.classList.add('revealed');
    topbar.classList.add('show');

    setTimeout(() => {
      splash.style.display = 'none';
      initReveal();
      initCarousel();
    }, 800);
  }

  splashBtn.addEventListener('click', dismissSplash);
  splashBtn.addEventListener('touchend', (e) => { e.preventDefault(); dismissSplash(); });

  /* ──────────────────────────────────────
     INTERSECTION OBSERVER — SCROLL REVEAL
  ────────────────────────────────────── */
  function initReveal() {
    const targets = main.querySelectorAll('.reveal');
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    targets.forEach(el => io.observe(el));
  }

  /* ──────────────────────────────────────
     CAROUSEL
  ────────────────────────────────────── */
  function initCarousel() {
    const track     = document.getElementById('carousel-track');
    const prevBtn   = document.getElementById('car-prev');
    const nextBtn   = document.getElementById('car-next');
    const dotsWrap  = document.getElementById('car-dots');

    if (!track) return;

    const slides = Array.from(track.querySelectorAll('.carousel-slide'));
    let current  = 0;
    let slideW   = 0;
    let gap      = 14;
    let autoplay = null;
    let isDrag   = false;
    let dragStartX = 0;
    let dragCurrentX = 0;
    let prevTranslate = 0;
    let currentTranslate = 0;

    // Build dots
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'car-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', 'Slide ' + (i + 1));
      dot.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(dot);
    });

    function measure() {
      slideW = slides[0] ? slides[0].offsetWidth : 0;
    }

    function goTo(idx) {
      if (idx < 0) idx = 0;
      if (idx >= slides.length) idx = slides.length - 1;
      current = idx;
      const offset = -(slideW + gap) * current;
      currentTranslate = offset;
      prevTranslate = offset;
      track.style.transform = `translateX(${offset}px)`;
      // Dots
      dotsWrap.querySelectorAll('.car-dot').forEach((d, i) => {
        d.classList.toggle('active', i === current);
      });
    }

    prevBtn.addEventListener('click', () => { stopAuto(); goTo(current - 1); });
    nextBtn.addEventListener('click', () => { stopAuto(); goTo(current + 1); });

    // Touch
    track.addEventListener('touchstart', e => {
      isDrag = true;
      dragStartX = e.touches[0].clientX;
      track.classList.add('dragging');
    }, { passive: true });

    track.addEventListener('touchmove', e => {
      if (!isDrag) return;
      dragCurrentX = e.touches[0].clientX;
      const diff = dragCurrentX - dragStartX;
      track.style.transform = `translateX(${prevTranslate + diff}px)`;
    }, { passive: true });

    track.addEventListener('touchend', () => {
      isDrag = false;
      track.classList.remove('dragging');
      const moved = dragCurrentX - dragStartX;
      if (moved < -50) goTo(current + 1);
      else if (moved > 50) goTo(current - 1);
      else goTo(current);
    });

    // Mouse
    track.addEventListener('mousedown', e => {
      isDrag = true;
      dragStartX = e.clientX;
      track.classList.add('dragging');
      e.preventDefault();
    });
    document.addEventListener('mousemove', e => {
      if (!isDrag) return;
      dragCurrentX = e.clientX;
      const diff = dragCurrentX - dragStartX;
      track.style.transform = `translateX(${prevTranslate + diff}px)`;
    });
    document.addEventListener('mouseup', () => {
      if (!isDrag) return;
      isDrag = false;
      track.classList.remove('dragging');
      const moved = dragCurrentX - dragStartX;
      if (moved < -50) goTo(current + 1);
      else if (moved > 50) goTo(current - 1);
      else goTo(current);
    });

    // Auto-play
    function startAuto() {
      autoplay = setInterval(() => {
        goTo(current < slides.length - 1 ? current + 1 : 0);
      }, 3800);
    }
    function stopAuto() {
      clearInterval(autoplay);
    }

    // Observe prep section to start/stop autoplay
    const prepSec = document.getElementById('s-prep');
    if (prepSec) {
      new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) startAuto();
        else stopAuto();
      }, { threshold: 0.3 }).observe(prepSec);
    }

    // Init
    window.addEventListener('load', () => { measure(); goTo(0); });
    window.addEventListener('resize', () => { measure(); goTo(current); });
  }

})();
