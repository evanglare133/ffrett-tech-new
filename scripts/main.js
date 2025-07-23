
/* scripts/main.js */
/* FFRETT TECH global script */
function loadComponent(id, file) {
  const container = document.getElementById(id);
  if (container) {
    fetch(file)
      .then(res => res.text())
      .then(html => container.innerHTML = html)
      .catch(err => console.error(`Error loading ${file}:`, err));
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  markActiveNavLink();
  initSmoothScroll();
  initLanguageToggle();
  initThemeToggle();
  initFAQAccordions();
  initScrollHeader();
  initLazyImages();
  loadComponent("header", "components/header.html");
  loadComponent("footer", "components/footer.html");

});

/* ----------------- Mobile Nav ----------------- */
function initMobileNav() {
  const btn = document.querySelector('.mobile-menu-btn');
  const nav = document.querySelector('.nav-links')?.closest('nav')?.querySelector('.nav-links');
  const menuContainer = document.querySelector('.nav-links')?.parentElement;
  if (!btn || !menuContainer) return;
  btn.addEventListener('click', () => {
    btn.classList.toggle('active');
    menuContainer.classList.toggle('active');
    const expanded = btn.classList.contains('active');
    btn.setAttribute('aria-expanded', expanded);
    document.body.style.overflow = expanded ? 'hidden' : '';
  });
  menuContainer.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      if (btn.classList.contains('active')) {
        btn.classList.remove('active');
        menuContainer.classList.remove('active');
        btn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && btn.classList.contains('active')) {
      btn.click();
    }
  });
}

/* ----------------- Active Nav Highlight ----------------- */
function markActiveNavLink() {
  const links = document.querySelectorAll('.nav-links a');
  const path = window.location.pathname.split('/').pop() || 'index.html';
  links.forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;
    const normalizedHref = href === '/' ? 'index.html' : href;
    if (path === normalizedHref) {
      link.classList.add('is-active');
    }
  });
}

/* ----------------- Smooth Scroll ----------------- */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const id = anchor.getAttribute('href');
      if (id.length > 1) {
        const target = document.querySelector(id);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          history.replaceState(null, '', id);
        }
      }
    });
  });
}

/* ----------------- Language Toggle ----------------- */
function initLanguageToggle() {
  const langBtns = document.querySelectorAll('[data-lang]');
  if (!langBtns.length) return;
  const saved = localStorage.getItem('ffrett-lang') || 'zh';
  applyLanguage(saved);
  langBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const lang = btn.getAttribute('data-lang');
      applyLanguage(lang);
      localStorage.setItem('ffrett-lang', lang);
    });
  });
}

function applyLanguage(lang) {
  document.documentElement.lang = lang === 'zh' ? 'zh-TW' : 'en';
  document.querySelectorAll('[data-lang]').forEach(b => {
    b.classList.toggle('active', b.getAttribute('data-lang') === lang);
  });
}

/* ----------------- Theme Toggle ----------------- */
function initThemeToggle() {
  const toggle = document.querySelector('[data-theme-toggle]');
  if (!toggle) return;
  const savedTheme = localStorage.getItem('ffrett-theme');
  if (savedTheme) applyTheme(savedTheme);
  toggle.addEventListener('click', () => {
    const current = document.documentElement.dataset.theme || 'light';
    const next = current === 'light' ? 'dark' : 'light';
    applyTheme(next);
    localStorage.setItem('ffrett-theme', next);
  });
}

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', theme === 'dark' ? '#1a1a1a' : '#2ECC71');
}

/* ----------------- FAQ Accordions ----------------- */
function initFAQAccordions() {
  const faqItems = document.querySelectorAll('.faq-item h4, .faq-item button');
  if (!faqItems.length) return;
  faqItems.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const item = trigger.closest('.faq-item');
      item?.classList.toggle('open');
    });
  });
}

/* ----------------- Scroll Header ----------------- */
function initScrollHeader() {
  const header = document.querySelector('header');
  if (!header) return;
  let last = 0;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    const goingDown = y > last && y > 80;
    header.classList.toggle('scroll-down', goingDown);
    header.classList.toggle('scroll-up', !goingDown && y > 80);
    if (y <= 80) header.classList.remove('scroll-down', 'scroll-up');
    last = y;
  }, { passive: true });
}

/* ----------------- Lazy Images ----------------- */
function initLazyImages() {
  const imgs = document.querySelectorAll('img[loading="lazy"]');
  if (!('IntersectionObserver' in window) || !imgs.length) return;
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const img = e.target;
        const dataSrc = img.dataset.src;
        if (dataSrc) img.src = dataSrc;
        io.unobserve(img);
      }
    });
  });
  imgs.forEach(img => io.observe(img));
}
