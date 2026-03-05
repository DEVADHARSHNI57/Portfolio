/* ═══════════════════════════════════════════════
   C Devadharshni — Portfolio JavaScript
   Handles: Cursor, Particles, Typewriter, Modals
═══════════════════════════════════════════════ */

// ─── CUSTOM CURSOR ───
const cursor = document.getElementById('cursor');
const ring   = document.getElementById('cursorRing');

const DOT_R  = 5;
let mouseX = -100, mouseY = -100;
let ringX  = -100, ringY  = -100;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.left = (mouseX - DOT_R) + 'px';
  cursor.style.top  = (mouseY - DOT_R) + 'px';
});

function animateRing() {
  ringX += (mouseX - ringX) * 0.13;
  ringY += (mouseY - ringY) * 0.13;
  const halfW = ring.offsetWidth  / 2;
  const halfH = ring.offsetHeight / 2;
  ring.style.left = (ringX - halfW) + 'px';
  ring.style.top  = (ringY - halfH) + 'px';
  requestAnimationFrame(animateRing);
}
animateRing();

document.querySelectorAll(
  'a, button, .project-card, .tech-row, .soft-row, .edu-card, .btn-primary, .btn-secondary, .btn-send, .modal-close'
).forEach(el => {
  el.addEventListener('mouseenter', () => ring.classList.add('ring-hover'));
  el.addEventListener('mouseleave', () => ring.classList.remove('ring-hover'));
});


// ─── PARTICLES ───
const canvas = document.getElementById('particles-canvas');
const ctx    = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const PARTICLE_COLORS = [
  { r: 108, g: 43,  b: 217 },
  { r: 180, g: 125, b: 255 },
  { r: 240, g: 192, b: 64  },
  { r: 155, g: 89,  b: 245 },
  { r: 180, g: 90,  b: 255 },
];

const particles = Array.from({ length: 100 }, () => {
  const c = PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)];
  return {
    x:           Math.random() * window.innerWidth,
    y:           Math.random() * window.innerHeight,
    r:           Math.random() * 2 + 0.5,
    dx:          (Math.random() - 0.5) * 0.4,
    dy:          (Math.random() - 0.5) * 0.4,
    baseOpacity: Math.random() * 0.5 + 0.2,
    pulse:       Math.random() * Math.PI * 2,
    cr: c.r, cg: c.g, cb: c.b
  };
});

function drawParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => {
    p.x     += p.dx;
    p.y     += p.dy;
    p.pulse += 0.012;
    if (p.x < 0 || p.x > canvas.width)  p.dx *= -1;
    if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
    const op = p.baseOpacity * (0.65 + 0.35 * Math.sin(p.pulse));
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${p.cr},${p.cg},${p.cb},${op.toFixed(3)})`;
    ctx.fill();
  });
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx   = particles[i].x - particles[j].x;
      const dy   = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 130) {
        const lineOp = (0.15 * (1 - dist / 130)).toFixed(3);
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(108,43,217,${lineOp})`;
        ctx.lineWidth   = 0.7;
        ctx.stroke();
      }
    }
  }
  requestAnimationFrame(drawParticles);
}
drawParticles();


// ─── PROJECT MODALS ───
function openModal(id) {
  document.getElementById(id).classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal(id) {
  document.getElementById(id).classList.remove('open');
  document.body.style.overflow = '';
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay.open').forEach(m => {
      m.classList.remove('open');
      document.body.style.overflow = '';
    });
  }
});


// ─── TYPEWRITER ───
const roles = [
  'Innovative Engineering Student.',
  'Electronics Enthusiast.',
  'Frontend Developer.',
  'ERP & Digital Learner.',
  'IoT Builder.'
];
let ri = 0, ci = 0, deleting = false;
const typed = document.getElementById('typed-role');

function typeWriter() {
  const current = roles[ri];
  if (!deleting) {
    typed.textContent = current.slice(0, ci + 1);
    ci++;
    if (ci === current.length) {
      deleting = true;
      setTimeout(typeWriter, 1800);
      return;
    }
  } else {
    typed.textContent = current.slice(0, ci - 1);
    ci--;
    if (ci === 0) {
      deleting = false;
      ri = (ri + 1) % roles.length;
    }
  }
  setTimeout(typeWriter, deleting ? 45 : 90);
}
typeWriter();


// ─── CONTACT FORM — FORMSPREE ───
const contactForm = document.getElementById('contactForm');
const sendBtn     = document.getElementById('sendBtn');
const formStatus  = document.getElementById('formStatus');

contactForm.addEventListener('submit', async e => {
  e.preventDefault();
  sendBtn.textContent   = 'Sending...';
  sendBtn.disabled      = true;
  sendBtn.style.opacity = '0.7';
  formStatus.innerHTML  = '';

  try {
    const response = await fetch('https://formspree.io/f/mgonwadr', {
      method:  'POST',
      headers: { 'Accept': 'application/json' },
      body:    new FormData(contactForm)
    });

    if (response.ok) {
      formStatus.innerHTML = `
        <div style="margin-top:14px;padding:14px 18px;background:rgba(0,200,120,0.08);border:1px solid rgba(0,200,120,0.3);border-left:3px solid #00c878;border-radius:0 10px 10px 0;color:#00c878;font-size:0.88rem;line-height:1.6;">
          ✅ Message sent! I'll get back to you soon.
        </div>`;
      contactForm.reset();
      sendBtn.textContent      = 'Sent ✦';
      sendBtn.style.background = 'linear-gradient(135deg,#00c878,#6c2bd9)';
    } else {
      throw new Error('Failed');
    }
  } catch {
    formStatus.innerHTML = `
      <div style="margin-top:14px;padding:14px 18px;background:rgba(240,80,80,0.08);border:1px solid rgba(240,80,80,0.3);border-left:3px solid #f05050;border-radius:0 10px 10px 0;color:#f05050;font-size:0.88rem;line-height:1.6;">
        ❌ Something went wrong. Please try again or email directly.
      </div>`;
    sendBtn.textContent   = 'Send Message ✦';
    sendBtn.disabled      = false;
    sendBtn.style.opacity = '1';
  }
});
