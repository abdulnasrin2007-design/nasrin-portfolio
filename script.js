/* ===================================================
   BACKEND ENDPOINT
   When deployed, change this to your Render URL:
   e.g. https://your-backend.onrender.com/send-message
   For local dev: http://localhost:3001/send-message
=================================================== */
const BACKEND_URL = '/api/send-message';

/* ===================================================
   PRELOADER — 4-5 seconds, text reads comfortably
=================================================== */
(function runPreloader() {
  const preloader = document.getElementById('preloader');
  const bar       = document.getElementById('preloaderBar');
  const pct       = document.getElementById('preloaderPct');
  if (!preloader) return;

  document.body.style.overflow = 'hidden';

  // Total duration ~4500ms with slight randomness
  const totalMs   = 4500;
  const tickMs    = 40;
  const totalTicks = totalMs / tickMs;
  let tick = 0;

  // Eased progress — slow start, steady middle, slight pause near end
  function easedProgress(t) {
    // t = 0..1, returns 0..100
    if (t < 0.15) return t / 0.15 * 18;            // 0–18% in first 15%
    if (t < 0.70) return 18 + (t - 0.15) / 0.55 * 67; // 18–85% in middle
    return 85 + (t - 0.70) / 0.30 * 15;            // 85–100% in last 30%
  }

  const timer = setInterval(() => {
    tick++;
    const t       = Math.min(tick / totalTicks, 1);
    const rounded = Math.floor(easedProgress(t));

    if (bar) bar.style.width = rounded + '%';
    if (pct) pct.textContent  = rounded + '%';

    if (t >= 1) {
      clearInterval(timer);
      setTimeout(() => {
        preloader.classList.add('hidden');
        document.body.style.overflow = '';
      }, 400);
    }
  }, tickMs);
})();

/* ===================================================
   NAVBAR
=================================================== */
const navbar      = document.getElementById('navbar');
const hamburger   = document.getElementById('hamburger');
const navLinks    = document.getElementById('navLinks');
const allNavLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 30);
  updateActiveNav();
}, { passive: true });

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

allNavLinks.forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

function updateActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 110) current = sec.id;
  });
  allNavLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === '#' + current);
  });
}
updateActiveNav();

/* ===================================================
   AOS — scroll reveal
=================================================== */
function initAOS() {
  const els = document.querySelectorAll('[data-aos]');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = parseInt(entry.target.dataset.aosDelay || 0);
        setTimeout(() => entry.target.classList.add('aos-animate'), delay);
      }
    });
  }, { threshold: 0.1 });
  els.forEach(el => obs.observe(el));
}
initAOS();

/* ===================================================
   CHARACTER COUNTER
=================================================== */
const msgArea    = document.getElementById('cf-message');
const charCounter = document.getElementById('charCounter');
if (msgArea) {
  msgArea.addEventListener('input', () => {
    if (charCounter) charCounter.textContent = `${msgArea.value.length}/500`;
  });
}

/* ===================================================
   MATH VERIFICATION
=================================================== */
let verifyAnswer = null;

function rnd(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

function generateVerification() {
  const ops = [
    () => { const a = rnd(3,15), b = rnd(2,12); return { q:`${a} + ${b}`, a: a+b }; },
    () => { const a = rnd(9,20), b = rnd(2,a);  return { q:`${a} − ${b}`, a: a-b }; },
    () => { const a = rnd(2,9),  b = rnd(2,9);  return { q:`${a} × ${b}`, a: a*b }; },
  ];
  const chosen   = ops[Math.floor(Math.random() * ops.length)]();
  verifyAnswer   = chosen.a;
  const qEl      = document.getElementById('verifyQuestion');
  if (qEl) qEl.textContent = chosen.q + ' = ?';
}

const verifyInput = document.getElementById('cf-verify');
const verifyHint  = document.getElementById('verifyHint');

if (verifyInput) {
  verifyInput.addEventListener('input', () => {
    const val = parseInt(verifyInput.value.trim());
    if (verifyInput.value.trim() === '') {
      verifyHint.textContent = '';
      verifyHint.className   = 'verify-hint';
    } else if (val === verifyAnswer) {
      verifyHint.textContent = 'Correct!';
      verifyHint.className   = 'verify-hint ok-msg';
      verifyInput.classList.remove('error');
    } else {
      verifyHint.textContent = '';
      verifyHint.className   = 'verify-hint';
    }
  });
}

generateVerification();

/* ===================================================
   CONTACT FORM — sends to Node/Express backend
=================================================== */
const contactForm = document.getElementById('contactForm');
let submitting = false;

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (submitting) return;

    const nameEl    = document.getElementById('cf-name');
    const emailEl   = document.getElementById('cf-email');
    const purposeEl = document.getElementById('cf-purpose');
    const messageEl = document.getElementById('cf-message');
    const submitBtn = document.getElementById('submitBtn');
    const btnText   = submitBtn.querySelector('.btn-text');
    const btnLoader = submitBtn.querySelector('.btn-loader');

    [nameEl, emailEl, purposeEl, messageEl].forEach(el => el.classList.remove('error'));
    if (verifyInput) verifyInput.classList.remove('error');
    if (verifyHint)  { verifyHint.textContent = ''; verifyHint.className = 'verify-hint'; }

    let valid = true;
    if (!nameEl.value.trim())                                                { nameEl.classList.add('error');    valid = false; }
    if (!emailEl.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailEl.value)) { emailEl.classList.add('error');   valid = false; }
    if (!purposeEl.value)                                                    { purposeEl.classList.add('error'); valid = false; }
    if (!messageEl.value.trim() || messageEl.value.trim().length < 10)      { messageEl.classList.add('error'); valid = false; }

    const userAns = parseInt(verifyInput ? verifyInput.value.trim() : '');
    if (isNaN(userAns) || userAns !== verifyAnswer) {
      if (verifyInput) verifyInput.classList.add('error');
      if (verifyHint)  {
        verifyHint.textContent = 'Please solve the verification question.';
        verifyHint.className   = 'verify-hint error-msg';
      }
      valid = false;
    }

    if (!valid) return;

    submitting            = true;
    submitBtn.disabled    = true;
    btnText.style.display  = 'none';
    btnLoader.style.display = 'inline';

    try {
      const res = await fetch(BACKEND_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name:    nameEl.value.trim(),
          email:   emailEl.value.trim(),
          purpose: purposeEl.value,
          message: messageEl.value.trim(),
        }),
      });

      if (!res.ok) throw new Error('Server error: ' + res.status);

      showPopup();
      contactForm.reset();
      if (charCounter) charCounter.textContent = '0/500';
      generateVerification();
      if (verifyHint) { verifyHint.textContent = ''; verifyHint.className = 'verify-hint'; }

    } catch (err) {
      alert('Something went wrong. Please try again or reach out via the social links below.');
      console.error('Send error:', err);
    } finally {
      submitting              = false;
      submitBtn.disabled      = false;
      btnText.style.display   = 'inline';
      btnLoader.style.display = 'none';
    }
  });
}

/* ===================================================
   POPUP
=================================================== */
function showPopup() { document.getElementById('popupOverlay').classList.add('show'); }
function closePopup() { document.getElementById('popupOverlay').classList.remove('show'); }
window.closePopup = closePopup;
document.getElementById('popupOverlay')?.addEventListener('click', e => { if (e.target === e.currentTarget) closePopup(); });

/* ===================================================
   HERO IMAGE FALLBACK
=================================================== */
const heroImg = document.getElementById('heroImg');
if (heroImg) {
  heroImg.addEventListener('error', () => {
    const circle = heroImg.parentElement;
    circle.style.background = 'linear-gradient(135deg,rgba(79,142,247,0.2),rgba(11,15,26,0.9))';
    circle.style.display = 'flex'; circle.style.alignItems = 'center'; circle.style.justifyContent = 'center';
    circle.innerHTML = '<span style="font-family:Space Grotesk,sans-serif;font-size:4rem;font-weight:700;color:rgba(79,142,247,0.6)">AN</span>';
  });
}

/* ===================================================
   PREMIUM CARD TILT (subtle depth effect)
   Applied to project cards, skill cards, edu card
=================================================== */
function initTilt() {
  const cards = document.querySelectorAll('.project-card, .skill-card, .edu-card, .stat-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect   = card.getBoundingClientRect();
      const x      = (e.clientX - rect.left) / rect.width  - 0.5;   // -0.5 to 0.5
      const y      = (e.clientY - rect.top)  / rect.height - 0.5;
      const rotX   = (-y * 6).toFixed(2);    // max 6deg
      const rotY   = ( x * 6).toFixed(2);
      card.style.transform  = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-4px) scale(1.02)`;
      card.style.transition = 'transform 0.05s linear';
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform  = '';
      card.style.transition = 'transform 0.4s ease, box-shadow 0.3s ease, border-color 0.3s ease';
    });
  });
}

// Only enable tilt on non-touch devices
if (!('ontouchstart' in window)) initTilt();
