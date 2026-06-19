const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ---- Reveal on scroll ----
const decodedTitles = new WeakSet();
const scrambleChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*';

function decodeText(el){
  if (decodedTitles.has(el) || reduceMotion) return;
  decodedTitles.add(el);
  const original = el.textContent;
  let iterations = 0;
  const interval = setInterval(() => {
    el.textContent = original.split('').map((char, idx) => {
      if (char === ' ') return ' ';
      if (idx < iterations) return original[idx];
      return scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
    }).join('');
    iterations += 0.6;
    if (iterations >= original.length) {
      clearInterval(interval);
      el.textContent = original;
    }
  }, 30);
}

const items = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        const title = e.target.querySelector('.section-title');
        if (title) decodeText(title);
      }
    });
  }, { threshold: 0.1 });
  items.forEach(i => io.observe(i));
} else {
  items.forEach(i => i.classList.add('in'));
}

// ---- Hero tagline typewriter ----
(function typeTagline(){
  const el = document.getElementById('taglineText');
  if (!el) return;
  const text = 'Automating the repetitive. Empowering the possible.';
  if (reduceMotion) { el.textContent = text; return; }
  let i = 0;
  function step(){
    el.textContent = text.slice(0, i);
    i++;
    if (i <= text.length) setTimeout(step, 35);
  }
  step();
})();

// ---- Sticky nav show/hide + scrollspy ----
const siteNav = document.getElementById('siteNav');
const navLinks = document.querySelectorAll('.nav-links a');
const spySections = document.querySelectorAll('main section[id]');

window.addEventListener('scroll', () => {
  siteNav.classList.toggle('visible', window.scrollY > window.innerHeight * 0.6);
}, { passive: true });

if ('IntersectionObserver' in window) {
  const spyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(l => l.classList.remove('active'));
        const link = document.querySelector(`.nav-links a[data-section="${entry.target.id}"]`);
        if (link) link.classList.add('active');
      }
    });
  }, { rootMargin: '-40% 0px -50% 0px', threshold: 0 });
  spySections.forEach(s => spyObserver.observe(s));
}

// ---- Pipeline scroll progress ----
const pipeline = document.getElementById('pipeline');
const fill = document.getElementById('pipelineFill');
const head = document.getElementById('pipelineHead');
let ticking = false;

function updateProgress(){
  const rect = pipeline.getBoundingClientRect();
  const total = rect.height + window.innerHeight;
  const scrolled = window.innerHeight - rect.top;
  let percent = scrolled / total;
  percent = Math.max(0, Math.min(1, percent));
  const px = percent * pipeline.offsetHeight;
  fill.style.height = px + 'px';
  head.style.top = (6 + px) + 'px';
  ticking = false;
}

function onScroll(){
  if (!ticking) {
    requestAnimationFrame(updateProgress);
    ticking = true;
  }
}

window.addEventListener('scroll', onScroll, { passive: true });
window.addEventListener('resize', onScroll);
window.addEventListener('load', updateProgress);
updateProgress();

// ---- Skill filter ----
const pillButtons = document.querySelectorAll('#skillPills .pill');
const nodes = document.querySelectorAll('.node');
const clearBtn = document.getElementById('clearFilter');
const activeSkills = new Set();

function applyFilter(){
  if (activeSkills.size === 0) {
    nodes.forEach(n => n.classList.remove('dimmed'));
    clearBtn.hidden = true;
    return;
  }
  clearBtn.hidden = false;
  nodes.forEach(n => {
    const skills = (n.dataset.skills || '').split(',');
    const match = skills.some(s => activeSkills.has(s));
    n.classList.toggle('dimmed', !match);
  });
}

pillButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const skill = btn.dataset.skill;
    if (activeSkills.has(skill)) {
      activeSkills.delete(skill);
      btn.classList.remove('active');
      btn.setAttribute('aria-pressed', 'false');
    } else {
      activeSkills.add(skill);
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');
    }
    applyFilter();
  });
});

if (clearBtn) {
  clearBtn.addEventListener('click', () => {
    activeSkills.clear();
    pillButtons.forEach(btn => { btn.classList.remove('active'); btn.setAttribute('aria-pressed', 'false'); });
    applyFilter();
  });
}

// ---- Stat count-up ----
function animateCount(el){
  const target = parseFloat(el.dataset.target);
  const suffix = el.dataset.suffix || '';
  if (reduceMotion) { el.textContent = target + suffix; return; }
  const duration = 900;
  const startTime = performance.now();
  function step(now){
    const progress = Math.min((now - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target) + suffix;
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}
if ('IntersectionObserver' in window) {
  const statObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { animateCount(entry.target); obs.unobserve(entry.target); }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('.stat-num').forEach(n => statObserver.observe(n));
}

// ---- Live clock (Kuala Lumpur) ----
function updateClock(){
  const el = document.getElementById('clockTime');
  if (!el) return;
  el.textContent = new Date().toLocaleTimeString('en-GB', { timeZone: 'Asia/Kuala_Lumpur', hour: '2-digit', minute: '2-digit' });
}
updateClock();
setInterval(updateClock, 30000);

// ---- Copy email + toast ----
const copyBtn = document.getElementById('copyEmailBtn');
const toast = document.getElementById('toast');
let toastTimer;
function showToast(msg){
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
}
if (copyBtn) {
  copyBtn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText('paakiyaleema13@gmail.com');
      showToast('Email copied to clipboard ✓');
    } catch (e) {
      showToast('Copy failed — email is paakiyaleema13@gmail.com');
    }
  });
}

// ---- Hero cursor glow ----
if (!reduceMotion) {
  const heroEl = document.querySelector('.hero');
  const cursorGlow = document.getElementById('cursorGlow');
  if (heroEl && cursorGlow) {
    heroEl.addEventListener('mousemove', (e) => {
      const rect = heroEl.getBoundingClientRect();
      cursorGlow.style.left = (e.clientX - rect.left) + 'px';
      cursorGlow.style.top = (e.clientY - rect.top) + 'px';
    });
  }
}

// ---- Card tilt (education/credential cards, representative work cards, award cards) ----
if (!reduceMotion) {
  document.querySelectorAll('.card, .work-card, .award-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left, y = e.clientY - rect.top;
      const cx = rect.width / 2, cy = rect.height / 2;
      const rotateX = ((y - cy) / cy) * -5;
      const rotateY = ((x - cx) / cx) * 5;
      card.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });
}
