/* ============================================================
   SVPassman — main.js
   Theme toggle · Mobile nav · Scroll animations · Docs sidebar
   ============================================================ */

// ── Theme ──────────────────────────────────────────────────────
(function () {
  const stored = localStorage.getItem('svpassman-theme');
  const preferred = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  const theme = stored || preferred;
  document.documentElement.setAttribute('data-theme', theme);
})();

document.addEventListener('DOMContentLoaded', () => {

  // Apply stored theme class early (icon visibility)
  const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';

  // ── Theme Toggle ──────────────────────────────────────────
  const toggleBtns = document.querySelectorAll('.theme-toggle');

  toggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('svpassman-theme', next);
    });
  });

  // ── Header scroll shadow ──────────────────────────────────
  const header = document.querySelector('.site-header');
  if (header) {
    const onScroll = () => {
      header.classList.toggle('scrolled', window.scrollY > 8);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ── Mobile hamburger ──────────────────────────────────────
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const open = hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open', open);
      hamburger.setAttribute('aria-expanded', open);
    });

    // Close on link click
    mobileMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
      });
    });

    // Close on outside click
    document.addEventListener('click', e => {
      if (!header.contains(e.target) && !mobileMenu.contains(e.target)) {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
      }
    });
  }

  // ── Scroll reveal ─────────────────────────────────────────
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length > 0) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    reveals.forEach((el, i) => {
      el.style.transitionDelay = `${(i % 4) * 0.08}s`;
      observer.observe(el);
    });
  }

  // ── Active nav link ───────────────────────────────────────
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link, .sidebar-link').forEach(link => {
    const href = link.getAttribute('href') || '';
    if (href === path || (path === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // ── TOC active tracking ───────────────────────────────────
  const tocLinks = document.querySelectorAll('.toc-link, .sidebar-link[href^="#"]');
  if (tocLinks.length > 0) {
    const headings = document.querySelectorAll('h2[id], h3[id]');
    const onTocScroll = () => {
      let current = '';
      headings.forEach(h => {
        if (window.scrollY >= h.offsetTop - 120) current = h.id;
      });
      tocLinks.forEach(link => {
        const href = link.getAttribute('href');
        link.classList.toggle('active', href === `#${current}`);
      });
    };
    window.addEventListener('scroll', onTocScroll, { passive: true });
  }

  // ── Docs sidebar toggle (mobile) ─────────────────────────
  const sidebarToggle = document.querySelector('.docs-sidebar-toggle');
  const sidebarNav = document.querySelector('.docs-sidebar-nav');
  if (sidebarToggle && sidebarNav) {
    sidebarToggle.addEventListener('click', () => {
      const open = sidebarNav.classList.toggle('open');
      sidebarToggle.setAttribute('aria-expanded', open);
    });
  }

  // ── Docs sidebar active section ───────────────────────────
  const docSections = document.querySelectorAll('.doc-section[id]');
  const sidebarLinks = document.querySelectorAll('.sidebar-link');
  if (docSections.length > 0) {
    const onDocScroll = () => {
      let active = '';
      docSections.forEach(sec => {
        if (window.scrollY >= sec.offsetTop - 140) active = sec.id;
      });
      sidebarLinks.forEach(link => {
        const href = (link.getAttribute('href') || '').replace('#', '');
        link.classList.toggle('active', href === active);
      });
    };
    window.addEventListener('scroll', onDocScroll, { passive: true });
    onDocScroll();
  }

  // ── Smooth anchor scroll with header offset ───────────────
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const id = link.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (target) {
        e.preventDefault();
        const offset = parseInt(getComputedStyle(document.documentElement)
          .getPropertyValue('--header-h')) || 64;
        window.scrollTo({
          top: target.offsetTop - offset - 16,
          behavior: 'smooth'
        });
      }
    });
  });

});
