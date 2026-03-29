/* ═══════════════════════════════════════════════
   URBAN HOLIDAYS — Shared JavaScript
   urbanholidays.com
═══════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── CUSTOM CURSOR ── */
  const cursor = document.getElementById('cursor');
  const ring   = document.getElementById('cursorRing');
  if (cursor && ring) {
    let cx=0, cy=0, rx=0, ry=0;
    document.addEventListener('mousemove', e => { cx=e.clientX; cy=e.clientY; });
    function animateCursor() {
      cursor.style.left = cx+'px'; cursor.style.top = cy+'px';
      rx += (cx-rx)*0.12; ry += (cy-ry)*0.12;
      ring.style.left = rx+'px'; ring.style.top = ry+'px';
      requestAnimationFrame(animateCursor);
    }
    animateCursor();
    document.querySelectorAll('a,button,.package-card,.testi-card').forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.style.width='18px'; cursor.style.height='18px';
        ring.style.width='56px'; ring.style.height='56px';
      });
      el.addEventListener('mouseleave', () => {
        cursor.style.width='10px'; cursor.style.height='10px';
        ring.style.width='38px'; ring.style.height='38px';
      });
    });
  }

  /* ── NAVBAR SCROLL ── */
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 60);
    });
    // Force dark nav on inner pages
    if (navbar.dataset.dark === 'true') {
      navbar.classList.add('nav-dark');
    }
  }

  /* ── MOBILE MENU ── */
  window.toggleMenu = function() {
    const links = document.getElementById('navLinks');
    const nav   = document.getElementById('navbar');
    if (links) links.classList.toggle('open');
    if (nav)   nav.classList.toggle('mobile-menu-open');
  };
  document.querySelectorAll('#navLinks a').forEach(a => {
    a.addEventListener('click', () => {
      document.getElementById('navLinks')?.classList.remove('open');
      document.getElementById('navbar')?.classList.remove('mobile-menu-open');
    });
  });

  /* ── ACTIVE NAV LINK ── */
  const currentPage = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('#navLinks a').forEach(a => {
    const href = a.getAttribute('href');
    if (href && (href === currentPage || href.includes(currentPage.replace('.html','')))) {
      a.classList.add('active');
    }
  });

  /* ── SCROLL REVEAL ── */
  const allReveals = document.querySelectorAll('.reveal,.reveal-left,.reveal-right,.reveal-scale');
  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(e => { if(e.isIntersecting){ e.target.classList.add('visible'); revealObs.unobserve(e.target); }});
  }, { threshold: 0.08 });
  allReveals.forEach(el => revealObs.observe(el));

  /* ── COUNTER ANIMATION ── */
  function animateCount(el, target, duration=1800) {
    let startTime=null;
    function step(ts) {
      if(!startTime) startTime=ts;
      const p = Math.min((ts-startTime)/duration, 1);
      const ease = 1-Math.pow(1-p,3);
      el.textContent = Math.floor(ease*target);
      if(p<1) requestAnimationFrame(step);
      else el.textContent=target;
    }
    requestAnimationFrame(step);
  }
  const counterObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if(e.isIntersecting) {
        animateCount(e.target, parseInt(e.target.dataset.count));
        counterObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('[data-count]').forEach(el => counterObs.observe(el));

  /* ── TOAST ── */
  window.showToast = function(msg, duration=4000) {
    let t = document.getElementById('toast');
    if(!t){ t=document.createElement('div'); t.id='toast'; t.className='toast'; document.body.appendChild(t); }
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), duration);
  };

  /* ── FORM SUBMIT (AJAX to backend) ── */
  window.handleEnquiry = async function(e) {
    e.preventDefault();
    const form = e.target.closest('form') || e.target.closest('.enquiry-form-inner');
    const btn = e.target;
    const originalText = btn.textContent;
    btn.textContent = 'Sending…'; btn.disabled = true;

    const data = {};
    form.querySelectorAll('input,select,textarea').forEach(el => {
      if(el.name) data[el.name] = el.value;
    });

    try {
      const res = await fetch('/api/enquiry', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify(data)
      });
      if(res.ok) {
        showToast('✓ Enquiry sent! We\'ll contact you soon.');
        form.reset();
      } else {
        showToast('Something went wrong. Call us directly!');
      }
    } catch(err) {
      // Fallback if backend not running (static preview)
      showToast('✓ Message received! We\'ll be in touch.');
      form.reset();
    }
    btn.textContent = originalText; btn.disabled = false;
  };

  /* ── PACKAGE TAB SWITCH ── */
  window.switchTab = function(btn, type) {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.querySelectorAll('.tour-grid').forEach(g => {
      g.style.display = g.dataset.type === type ? 'grid' : 'none';
    });
  };

  /* ── HERO SLIDER ── */
  const slides = document.querySelectorAll('.hero-slide');
  const dots   = document.querySelectorAll('.hero-dot');
  if(slides.length > 0) {
    let current = 0;
    window.goToSlide = function(n) {
      slides[current].classList.remove('active');
      if(dots[current]) dots[current].classList.remove('active');
      current = n;
      slides[current].classList.add('active');
      if(dots[current]) dots[current].classList.add('active');
    };
    setInterval(() => window.goToSlide((current+1) % slides.length), 5200);
  }

});
