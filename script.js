/* =============================================
   MAIN SCRIPT
   ============================================= */

// ── Particle Generator ─────────────────────
function initParticles() {
  const field = document.getElementById('particleField');
  if (!field) return;
  const count = 40;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 3 + 1;
    p.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${Math.random() * 100}%;
      animation-duration: ${Math.random() * 15 + 10}s;
      animation-delay: ${Math.random() * 15}s;
      opacity: ${Math.random() * 0.4 + 0.1};
    `;
    field.appendChild(p);
  }
}

// ── Scroll Reveal ──────────────────────────
function initReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

// ── Navbar Scroll ──────────────────────────
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const toggle = document.getElementById('navToggle');
  const links = document.querySelector('.nav-links');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  });

  toggle?.addEventListener('click', () => {
    links?.classList.toggle('open');
  });

  // Close on link click
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.addEventListener('click', () => links?.classList.remove('open'));
  });
}

// ── Counter Animation ──────────────────────
function animateCounter(el, target, duration = 1500) {
  let start = null;
  const isFloat = target % 1 !== 0;

  function step(timestamp) {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    const current = ease * target;
    el.textContent = isFloat ? current.toFixed(1) : Math.floor(current);
    if (progress < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

function initCounters() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const numEl = entry.target.querySelector('.stat-number');
        const barFill = entry.target.querySelector('.stat-bar-fill');
        const ringFill = entry.target.querySelector('.ring-fill');

        if (numEl) {
          const target = parseFloat(numEl.dataset.target);
          animateCounter(numEl, target);
        }

        if (barFill) {
          setTimeout(() => {
            barFill.style.width = barFill.style.getPropertyValue('--w');
          }, 200);
        }

        if (ringFill) {
          const pct = parseFloat(ringFill.dataset.percent || ringFill.style.getPropertyValue('--pct'));
          const circumference = 2 * Math.PI * 52; // r=52
          const offset = circumference - (pct / 100) * circumference;
          setTimeout(() => {
            ringFill.style.strokeDashoffset = offset;
          }, 300);
        }

        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('.stat-card').forEach(el => observer.observe(el));
}

// ── Smooth Anchor Scrolling ────────────────
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

// ── Active Nav Highlight ───────────────────
function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.style.color = '';
          if (link.getAttribute('href') === '#' + entry.target.id) {
            link.style.color = 'var(--secondary)';
          }
        });
      }
    });
  }, { threshold: 0.5 });

  sections.forEach(s => observer.observe(s));
}

// ── Parallax on Hero ───────────────────────
function initParallax() {
  const orbs = document.querySelectorAll('.orb');
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    orbs.forEach((orb, i) => {
      const speed = (i + 1) * 0.15;
      orb.style.transform = `translateY(${y * speed}px)`;
    });
  }, { passive: true });
}

// ── Card Tilt ──────────────────────────────
function initCardTilt() {
  document.querySelectorAll('.overview-card, .stat-card, .gap-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const rx = (y - cy) / cy * 5;
      const ry = (cx - x) / cx * 5;
      card.style.transform = `perspective(600px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-6px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

// ── Sample Bars Animation ──────────────────
function initSampleBars() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.sample-bar').forEach(bar => {
          const targetW = bar.style.getPropertyValue('--w');
          bar.style.width = '0';
          setTimeout(() => { bar.style.width = targetW; }, 300);
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  document.querySelectorAll('.timeline-content').forEach(el => observer.observe(el));
}

// ── Init All ──────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  initReveal();
  initNavbar();
  initCounters();
  initSmoothScroll();
  initActiveNav();
  initParallax();
  initCardTilt();
  initSampleBars();
});
