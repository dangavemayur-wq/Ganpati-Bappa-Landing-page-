/**
 * Ganpati Bappa Invitation — script.js
 * ─ Curtain-reveal splash
 * ─ Sticky top-bar show/hide
 * ─ IntersectionObserver scroll reveal
 * ─ Floating marigold petals & gold sparkles particle canvas
 */

/* ═══════════════════════════════════════
   EASILY EDITABLE CONTENT VARIABLES
═══════════════════════════════════════ */
const CONTENT = {
  familyName:   'घोले परिवार',
  hostName:     'श्री. निनाद संतोष घोले',
  hostPhone:    '+918779638499',
  hostAddress:  'डी/४०१, प्लॅटिनम हाईट, खंडागले कंपाउंड, गाढव नाका जवळ, उत्कर्ष नगर रोड, भांडुप (पश्चिम), मुंबई - ४०००७८',
  hostCity:     'भांडुप (पश्चिम), मुंबई',
  mapsLink:     'https://maps.google.com/?q=Bhandup+West+Mumbai+400078',
  year:         '२०२६',

  events: [
    { label:'',       title:'सत्यनारायण पूजा',   date:'१६ ऑगस्ट २०२६',    times:['🌆 सायंकाळी ८:००', 'महाप्रसाद'] },
    { label:'दिवस १',  title:'प्राणप्रतिष्ठा (स्थापना)', date:'१४ सप्टेंबर २०२६', times:['🌅 सकाळी १०:००'] },
    { label:'दररोज',  title:'अथर्वशीर्ष पठण',       date:'१४ – १९ सप्टेंबर', times:[] },
    { label:'अंतिम',   title:'विसर्जन',               date:'१९ सप्टेंबर २०२६', times:['🌆 सायंकाळी ४:००'] },
  ],
};

/* ═══════════════════════════════════════
   INIT
═══════════════════════════════════════ */
(function () {
  'use strict';

  const splash        = document.getElementById('splash');
  const splashBtn     = document.getElementById('splash-btn');
  const main          = document.getElementById('main');
  const topbar        = document.getElementById('topbar');
  const btnCall       = document.getElementById('btn-call');
  const hostPhoneLink = document.getElementById('host-phone-link');
  const hostPhoneVal  = document.getElementById('host-phone-val');

  // Patch live content from variables
  if (btnCall) btnCall.href = 'tel:' + CONTENT.hostPhone;
  if (hostPhoneLink) hostPhoneLink.href = 'tel:' + CONTENT.hostPhone;
  if (hostPhoneVal) hostPhoneVal.textContent = '8779638499';

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
      initTimelineScroll();
      initMurtiReveal();
      initPetals();
    }, 800);
  }

  if (splashBtn) {
    splashBtn.addEventListener('click', dismissSplash);
    splashBtn.addEventListener('touchend', (e) => { e.preventDefault(); dismissSplash(); });
  }

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
    }, { threshold: 0.1, rootMargin: '0px 0px -20px 0px' });

    targets.forEach(el => io.observe(el));
  }

  /* ──────────────────────────────────────
     TIMELINE INDIVIDUAL SCROLL REVEAL
  ────────────────────────────────────── */
  function initTimelineScroll() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    if (!timelineItems.length) return;

    const timelineObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          timelineObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.2,
      rootMargin: '0px 0px -40px 0px'
    });

    timelineItems.forEach((item, index) => {
      item.style.setProperty('--item-delay', `${index * 0.15}s`);
      timelineObserver.observe(item);
    });
  }

  /* ──────────────────────────────────────
     MURTI REVEAL (SCROLL & CLICK)
  ────────────────────────────────────── */
  function initMurtiReveal() {
    const revealSection = document.getElementById('s-reveal');
    const stage = document.getElementById('reveal-stage');
    if (!revealSection || !stage) return;

    let hasRevealed = false;

    function openCurtains() {
      if (!hasRevealed) {
        hasRevealed = true;
        revealSection.classList.add('open');
      }
    }

    // Scroll trigger (triggers when stage enters viewport)
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !hasRevealed) {
          setTimeout(openCurtains, 350); // smooth short delay on scroll
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.35 });
    
    observer.observe(stage);

    // Click/Touch manual trigger on entire stage
    stage.addEventListener('click', openCurtains);
    stage.addEventListener('touchstart', () => {
      openCurtains();
    }, { passive: true });
  }

  /* ──────────────────────────────────────
     FLOATING PETALS & SPARKLES ANIMATION
  ────────────────────────────────────── */
  function initPetals() {
    const canvas = document.getElementById('petal-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const count = 10;

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: 2.5 + Math.random() * 3,
        speedY: 0.25 + Math.random() * 0.45,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.018,
        color: Math.random() > 0.4 ? '#F5A623' : (Math.random() > 0.5 ? '#DAA520' : '#FFD700'),
        opacity: 0.25 + Math.random() * 0.35,
        isSparkle: Math.random() > 0.65
      });
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.y += p.speedY;
        p.x += Math.sin(p.y * 0.012) * 0.6;
        p.rotation += p.rotationSpeed;

        if (p.y > height + 20) {
          p.y = -20;
          p.x = Math.random() * width;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = p.opacity;

        if (p.isSparkle) {
          ctx.fillStyle = '#FFD700';
          ctx.shadowBlur = 8;
          ctx.shadowColor = '#FFD700';
          ctx.beginPath();
          ctx.arc(0, 0, p.radius * 0.6, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillStyle = p.color;
          ctx.shadowBlur = 4;
          ctx.shadowColor = '#F5A623';
          ctx.beginPath();
          ctx.ellipse(0, 0, p.radius * 1.5, p.radius * 0.75, 0, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      });

      requestAnimationFrame(animate);
    }

    animate();
  }

  // Also trigger petals on load
  window.addEventListener('DOMContentLoaded', initPetals);

})();
