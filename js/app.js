/**
 * All Seasons Windows & Doors — App.js
 * Lenis smooth scroll + GSAP ScrollTrigger animations
 */

/* ── Lenis Smooth Scroll ──────────────────────────────────────── */
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  direction: 'vertical',
  smooth: true,
});

gsap.registerPlugin(ScrollTrigger);

// Wire Lenis to GSAP ticker
gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

// Wire Lenis scroll to ScrollTrigger
lenis.on('scroll', () => {
  ScrollTrigger.update();
});

/* ── Navigation ───────────────────────────────────────────────── */
const nav       = document.getElementById('nav');
const burger    = document.getElementById('burger');
const mobileNav = document.getElementById('mobileNav');
const mobileClose = document.getElementById('mobileClose');

ScrollTrigger.create({
  start: 'top -80px',
  onEnter:     () => nav.classList.add('scrolled'),
  onLeaveBack: () => nav.classList.remove('scrolled'),
});

burger.addEventListener('click', () => {
  mobileNav.classList.add('open');
  lenis.stop();
});
mobileClose.addEventListener('click', () => {
  mobileNav.classList.remove('open');
  lenis.start();
});
mobileNav.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    mobileNav.classList.remove('open');
    lenis.start();
  });
});

/* ── Hero entrance animation ──────────────────────────────────── */
const heroTL = gsap.timeline({ delay: 0.2 });

document.querySelectorAll('.ht-line').forEach((line, i) => {
  const inner = document.createElement('span');
  inner.innerHTML = line.innerHTML;
  inner.style.display = 'block';
  inner.style.transform = 'translateY(110%)';
  line.innerHTML = '';
  line.appendChild(inner);

  heroTL.to(inner, {
    y: '0%',
    duration: 1.1,
    ease: 'expo.out',
  }, i * 0.12);
});

heroTL
  .to('.hero-eyebrow', { opacity: 1, y: 0, duration: 0.9, ease: 'expo.out' }, 0.08)
  .to('.hero-sub',     { opacity: 1, y: 0, duration: 0.9, ease: 'expo.out' }, 0.42)
  .to('.hero-actions', { opacity: 1, y: 0, duration: 0.9, ease: 'expo.out' }, 0.56)
  .to('.hero-trust',   { opacity: 1, y: 0, duration: 0.9, ease: 'expo.out' }, 0.70);

/* ── Section Reveal Helper ────────────────────────────────────── */
function clearReveal(el) {
  el.removeAttribute('data-reveal');
  gsap.set(el, { clearProps: 'all' });
}

function revealOnScroll(selector, vars = {}) {
  document.querySelectorAll(selector).forEach(el => {
    gsap.to(el, {
      scrollTrigger: {
        trigger: el,
        start: 'top 86%',
        once: true,
      },
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      duration: vars.duration || 0.9,
      ease: vars.ease || 'expo.out',
      delay: vars.delay || 0,
      onComplete() { clearReveal(el); },
    });
  });
}

/* ── Fade reveals ─────────────────────────────────────────────── */
revealOnScroll('[data-reveal="fade"]',  { duration: 1.0 });
revealOnScroll('[data-reveal="left"]',  { duration: 1.1 });
revealOnScroll('[data-reveal="right"]', { duration: 1.1 });

/* ── Scale reveals (cards — staggered by position in row) ────── */
document.querySelectorAll('[data-reveal="scale"]').forEach((el, i) => {
  gsap.to(el, {
    scrollTrigger: { trigger: el, start: 'top 88%', once: true },
    opacity: 1,
    scale: 1,
    y: 0,
    duration: 0.85,
    ease: 'expo.out',
    delay: (i % 3) * 0.09,
    onComplete() { clearReveal(el); },
  });
});

/* ── Stats — fade in with counter animation ───────────────────── */
document.querySelectorAll('.stat-item').forEach((el, i) => {
  gsap.to(el, {
    scrollTrigger: { trigger: el, start: 'top 85%', once: true },
    opacity: 1,
    y: 0,
    duration: 0.85,
    ease: 'expo.out',
    delay: i * 0.1,
  });
});

document.querySelectorAll('.counter').forEach(el => {
  const target   = parseFloat(el.dataset.target);
  const decimals = parseInt(el.dataset.decimals || '0');
  const obj = { val: 0 };

  ScrollTrigger.create({
    trigger: el,
    start: 'top 85%',
    once: true,
    onEnter: () => {
      gsap.to(obj, {
        val: target,
        duration: 2.2,
        ease: 'power3.out',
        onUpdate() {
          el.textContent = obj.val.toFixed(decimals);
        },
      });
    },
  });
});

/* ── Testimonials — cascade from bottom ──────────────────────── */
document.querySelectorAll('[data-reveal="bottom"]').forEach((el, i) => {
  gsap.to(el, {
    scrollTrigger: { trigger: el, start: 'top 89%', once: true },
    opacity: 1,
    y: 0,
    duration: 0.85,
    ease: 'expo.out',
    delay: (i % 3) * 0.1,
    onComplete() { clearReveal(el); },
  });
});

/* ── Why list — stagger in from right ────────────────────────── */
ScrollTrigger.create({
  trigger: '.why-list',
  start: 'top 80%',
  once: true,
  onEnter: () => {
    gsap.to('.why-item', {
      opacity: 1,
      x: 0,
      duration: 0.75,
      ease: 'expo.out',
      stagger: 0.1,
    });
  },
});

/* ── Story image: subtle parallax on scroll ───────────────────── */
gsap.to('.story-img-wrap', {
  scrollTrigger: {
    trigger: '.story',
    start: 'top bottom',
    end: 'bottom top',
    scrub: 1.5,
  },
  y: -30,
  ease: 'none',
});

/* ── Hero content: subtle parallax ───────────────────────────── */
gsap.to('.hero-content', {
  scrollTrigger: {
    trigger: '.hero',
    start: 'top top',
    end: 'bottom top',
    scrub: 1,
  },
  y: 80,
  ease: 'none',
});

/* ── Product card hover glow ──────────────────────────────────── */
document.querySelectorAll('.prod-card:not(.prod-card--accent)').forEach(card => {
  card.addEventListener('mouseenter', () => {
    gsap.to(card, { boxShadow: '0 16px 48px rgba(44,110,73,0.10)', duration: 0.35 });
  });
  card.addEventListener('mouseleave', () => {
    gsap.to(card, { boxShadow: '0 0 0 rgba(0,0,0,0)', duration: 0.35 });
  });
});

/* ── About card: top-bar reveal on hover (GSAP backup) ───────── */
document.querySelectorAll('.about-card').forEach(card => {
  card.addEventListener('mouseenter', () => {
    gsap.to(card.querySelector('::before'), { scaleX: 1, duration: 0.4 });
  });
});

/* ── Smooth nav anchor links ──────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const href = a.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    lenis.scrollTo(target, { offset: -80, duration: 1.4 });
  });
});
