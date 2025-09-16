/* script.js
   Handles:
   - Intro overlay (on homepage)
   - Smooth cross-page fade transitions (intercepts clicks on internal links)
   - Hamburger toggle (small screens)
   - scrollToProjects helper
   - Contact form validation (client-side)
*/

/* ---------- Helpers ---------- */

function isSameOrigin(href) {
  const a = document.createElement('a');
  a.href = href;
  return location.origin === a.origin;
}

/* ---------- Page transition: intercept internal links and fade out ---------- */
document.addEventListener('click', function (e) {
  const a = e.target.closest('a');
  if (!a) return;
  const href = a.getAttribute('href');

  // if external, normal behavior
  if (!href || href.startsWith('mailto:') || href.startsWith('#') || !isSameOrigin(href)) return;

  // allow links with target _blank
  if (a.target === '_blank') return;

  // Prevent default and animate fade out
  e.preventDefault();
  document.body.classList.add('page-exit-active'); // CSS reduces opacity
  // delay navigation to allow fade animation (match transition in CSS)
  setTimeout(() => { window.location.href = href; }, 280);
});

/* On load, run enter animation (fade-in) */
window.addEventListener('DOMContentLoaded', () => {
  document.body.classList.add('page-enter-active');
});

/* ---------- Intro overlay (on index.html) ---------- */
(function setupIntro() {
  const overlay = document.getElementById('introOverlay');
  if (!overlay) return; // only on homepage

  // After animations complete, hide overlay and allow interaction
  // CSS animation already fades out after 3s; ensure removal for accessibility
  setTimeout(() => {
    overlay.style.display = 'none';
  }, 3800);

  // Allow skip on click or key (Escape)
  overlay.addEventListener('click', () => { overlay.style.display = 'none'; });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') overlay.style.display = 'none'; });
})();

/* ---------- Hamburger menu toggle ---------- */
(function setupHamburger() {
  const hamburger = document.querySelector('.hamburger');
  const navlinks = document.querySelector('.navlinks');
  if (!hamburger) return;
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    if (!navlinks) return;
    if (navlinks.style.display === 'flex') {
      navlinks.style.display = '';
    } else {
      navlinks.style.display = 'flex';
      navlinks.style.flexDirection = 'column';
      navlinks.style.background = 'linear-gradient(180deg, rgba(20,20,20,0.95), rgba(0,0,0,0.9))';
      navlinks.style.position = 'absolute';
      navlinks.style.right = '20px';
      navlinks.style.top = '64px';
      navlinks.style.padding = '12px';
      navlinks.style.borderRadius = '10px';
    }
  });
})();

/* ---------- scrollToProjects helper ---------- */
function scrollToProjects() {
  const el = document.getElementById('projects-preview');
  if (!el) { window.location.href = 'projects.html'; return; }
  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* ---------- Contact form validation ---------- */
(function setupContactValidation() {
  const form = document.querySelector('form#contact-form');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = form.querySelector('input[name=name]');
    const email = form.querySelector('input[name=email]');
    const message = form.querySelector('textarea[name=message]');
    let ok = true;

    [name, email, message].forEach(inp => inp.classList.remove('invalid'));
    // simple checks
    if (!name.value.trim()) { ok = false; name.classList.add('invalid'); }
    if (!/^\S+@\S+\.\S+$/.test(email.value)) { ok = false; email.classList.add('invalid'); }
    if (!message.value.trim() || message.value.trim().length < 10) { ok = false; message.classList.add('invalid'); }

    if (!ok) {
      alert('Please complete the form correctly. Make sure email is valid and message is at least 10 characters.');
      return;
    }

    // success (no server). You can replace with fetch() to your API endpoint.
    alert('Thanks! Your message has been composed (demo). To enable real sending, integrate a backend or service like EmailJS.');
    form.reset();
  });
})();

/* Expose for inline onclick handlers */
window.scrollToProjects = scrollToProjects;
