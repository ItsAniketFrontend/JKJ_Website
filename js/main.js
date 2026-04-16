/* ============================================
   JKJ JEWELLERS — Main JavaScript
   ============================================ */

'use strict';

/* ---- Header scroll effect ---- */
const siteHeader = document.getElementById('siteHeader');
const scrollTopBtn = document.getElementById('scrollTop');

window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    siteHeader.classList.add('scrolled');
    scrollTopBtn.classList.add('visible');
  } else {
    siteHeader.classList.remove('scrolled');
    scrollTopBtn.classList.remove('visible');
  }
}, { passive: true });

scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ---- Mobile hamburger ---- */
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
    const spans = hamburger.querySelectorAll('span');
    if (mobileMenu.classList.contains('open')) {
      spans[0].style.transform = 'rotate(45deg) translateY(9px)';
      spans[1].style.opacity   = '0';
      spans[2].style.transform = 'rotate(-45deg) translateY(-9px)';
    } else {
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
  });
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      hamburger.querySelectorAll('span').forEach(s => {
        s.style.transform = ''; s.style.opacity = '';
      });
    });
  });
}

/* ---- Smooth anchor scroll with header offset ---- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const id = anchor.getAttribute('href');
    if (id === '#') return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    const headerH = siteHeader ? siteHeader.offsetHeight : 0;
    const top = target.getBoundingClientRect().top + window.scrollY - headerH - 16;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ---- Category nav active state on scroll ---- */
const catItems = document.querySelectorAll('.cat-nav-item');
const sections = document.querySelectorAll('section[id]');

const navObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        catItems.forEach(item => {
          const href = item.getAttribute('href');
          item.classList.toggle('active', href === `#${entry.target.id}`);
        });
      }
    });
  },
  { threshold: 0.4 }
);
sections.forEach(s => navObserver.observe(s));

/* ---- Reveal on scroll ---- */
const revealObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
);
document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
  revealObserver.observe(el);
});

/* ---- Counter animation ---- */
function animateCounter(el, target, duration = 2000) {
  const start = performance.now();
  const tick = now => {
    const p = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    const val = Math.round(eased * target);
    el.textContent = target >= 1000 ? val.toLocaleString('en-IN') : val;
    if (p < 1) requestAnimationFrame(tick);
    else el.textContent = target >= 1000 ? target.toLocaleString('en-IN') : target;
  };
  requestAnimationFrame(tick);
}

const statsSection = document.querySelector('.section-stats');
if (statsSection) {
  new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        statsSection.querySelectorAll('.stat-big[data-count]').forEach(el => {
          animateCounter(el, parseInt(el.dataset.count, 10));
        });
      }
    },
    { threshold: 0.5 }
  ).observe(statsSection);
}

/* ---- Testimonials slider ---- */
const track = document.getElementById('testiTrack');
const dots  = document.querySelectorAll('#testiDots .dot-btn');
let current = 0;
let perView = () => window.innerWidth <= 768 ? 1 : 2;
let autoTimer;

function goTo(index) {
  const cards = track.children;
  const max = cards.length - perView();
  current = Math.max(0, Math.min(index, max));
  const w = cards[0].offsetWidth + 24;
  track.style.transform = `translateX(-${current * w}px)`;
  dots.forEach((d, i) => d.classList.toggle('active', i === current));
}

dots.forEach(d => d.addEventListener('click', () => {
  clearInterval(autoTimer);
  goTo(parseInt(d.dataset.index));
  startAuto();
}));

function startAuto() {
  autoTimer = setInterval(() => {
    const max = track.children.length - perView();
    goTo(current >= max ? 0 : current + 1);
  }, 5000);
}
startAuto();

// Touch/swipe
let dragX = 0;
let dragging = false;
track.addEventListener('mousedown', e => { dragX = e.clientX; dragging = true; });
track.addEventListener('touchstart', e => { dragX = e.touches[0].clientX; dragging = true; }, { passive: true });

window.addEventListener('mouseup', e => {
  if (!dragging) return;
  dragging = false;
  const diff = dragX - e.clientX;
  if (Math.abs(diff) > 50) goTo(diff > 0 ? current + 1 : current - 1);
});
window.addEventListener('touchend', e => {
  if (!dragging) return;
  dragging = false;
  const diff = dragX - e.changedTouches[0].clientX;
  if (Math.abs(diff) > 50) goTo(diff > 0 ? current + 1 : current - 1);
}, { passive: true });

window.addEventListener('resize', () => goTo(0), { passive: true });

/* ---- Contact form ---- */
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    const btn = document.getElementById('submitBtn');
    const orig = btn.textContent;
    btn.textContent = 'Sending…';
    btn.disabled = true;

    setTimeout(() => {
      btn.textContent = 'Enquiry Sent ✓';
      btn.style.background = '#2d7a3a';
      setTimeout(() => {
        contactForm.reset();
        btn.textContent = orig;
        btn.style.background = '';
        btn.disabled = false;
      }, 3000);
    }, 1200);
  });
}

/* ---- Subtle hero parallax ---- */
const heroBg = document.querySelector('.hero-bg');
window.addEventListener('scroll', () => {
  if (window.scrollY < window.innerHeight && heroBg) {
    heroBg.style.transform = `translateY(${window.scrollY * 0.12}px)`;
  }
}, { passive: true });
