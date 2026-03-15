/**
 * RiskCube — Institute of Digital Risk
 * Vanilla JS: smooth scroll, sticky nav scroll state, mobile nav toggle.
 * Site remains usable without JS (anchor navigation still works).
 */

(function () {
  'use strict';

  var nav = document.getElementById('site-nav');
  var toggle = document.querySelector('.nav-toggle');
  var header = document.querySelector('.site-header');

  /**
   * Smooth scroll for in-page anchor links.
   * Uses scrollIntoView when supported; otherwise default jump is used.
   */
  function initSmoothScroll() {
    document.addEventListener('click', function (e) {
      var link = e.target.closest('a[href^="#"]');
      if (!link || link.getAttribute('href') === '#') return;

      var id = link.getAttribute('href').slice(1);
      var target = id ? document.getElementById(id) : null;
      if (!target) return;

      e.preventDefault();

      if ('scrollBehavior' in document.documentElement.style) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        target.scrollIntoView(true);
      }

      // Close mobile nav after clicking a link
      if (nav && nav.classList.contains('is-open')) {
        closeNav();
      }
    });
  }

  /**
   * Open mobile nav: show menu, lock body scroll, update ARIA, focus first link.
   */
  function openNav() {
    if (!nav || !toggle) return;
    nav.classList.add('is-open');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Close main menu');
    document.body.classList.add('nav-open');
    var firstLink = nav.querySelector('a');
    if (firstLink) {
      setTimeout(function () { firstLink.focus(); }, 100);
    }
  }

  /**
   * Close mobile nav: hide menu, unlock body scroll, update ARIA, return focus to toggle.
   */
  function closeNav() {
    if (!nav || !toggle) return;
    nav.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open main menu');
    document.body.classList.remove('nav-open');
    toggle.focus();
  }

  /**
   * Toggle mobile nav on button click.
   */
  function handleToggleClick() {
    if (!nav || !toggle) return;
    var isOpen = nav.classList.contains('is-open');
    if (isOpen) {
      closeNav();
    } else {
      openNav();
    }
  }

  /**
   * Close nav on Escape key.
   */
  function handleKeydown(e) {
    if (e.key !== 'Escape') return;
    if (nav && nav.classList.contains('is-open')) {
      closeNav();
      if (toggle) toggle.focus();
    }
  }

  /**
   * Close nav when clicking outside (e.g. overlay).
   */
  function handleClickOutside(e) {
    if (!nav || !nav.classList.contains('is-open')) return;
    if (toggle && toggle.contains(e.target)) return;
    if (nav.contains(e.target)) return;
    closeNav();
  }

  /**
   * Trap focus inside mobile nav when open: Tab from last goes to first; Shift+Tab from first goes to toggle.
   */
  function handleNavKeydown(e) {
    if (!nav || !nav.classList.contains('is-open') || e.key !== 'Tab') return;
    var focusables = nav.querySelectorAll('a[href]');
    if (focusables.length === 0) return;
    var first = focusables[0];
    var last = focusables[focusables.length - 1];
    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        toggle.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  function initMobileNav() {
    if (!toggle) return;

    toggle.addEventListener('click', handleToggleClick);
    document.addEventListener('keydown', handleKeydown);
    document.addEventListener('click', handleClickOutside);
    document.addEventListener('keydown', handleNavKeydown);
  }

  /**
   * Sticky header: add shadow when page is scrolled (for visual separation).
   */
  function initStickyHeader() {
    if (!header) return;

    function updateScrollState() {
      if (window.scrollY > 10) {
        header.classList.add('is-scrolled');
      } else {
        header.classList.remove('is-scrolled');
      }
    }

    updateScrollState();
    window.addEventListener('scroll', updateScrollState, { passive: true });
  }

  /**
   * Navigation active state: highlight the link for the section currently in view.
   */
  function initNavActiveState() {
    var sectionIds = ['hero', 'trust', 'about', 'operating-model', 'community', 'case-study', 'contact'];
    var navLinks = document.querySelectorAll('.site-nav__link');
    var sectionRatios = {};

    function getLinkForSection(id) {
      for (var i = 0; i < navLinks.length; i++) {
        var href = navLinks[i].getAttribute('href');
        if (href === '#' + id) return navLinks[i];
      }
      return null;
    }

    function setActiveSection(activeId) {
      navLinks.forEach(function (link) {
        link.classList.remove('is-active');
        link.removeAttribute('aria-current');
      });
      var activeLink = activeId ? getLinkForSection(activeId) : null;
      if (activeLink) {
        activeLink.classList.add('is-active');
        activeLink.setAttribute('aria-current', 'section');
      }
    }

    function updateActiveFromRatios() {
      var maxRatio = 0;
      var activeId = null;
      sectionIds.forEach(function (id) {
        var r = sectionRatios[id] || 0;
        if (r > maxRatio) {
          maxRatio = r;
          activeId = id;
        }
      });
      setActiveSection(activeId);
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          var id = entry.target.id;
          if (id) sectionRatios[id] = entry.intersectionRatio;
        });
        updateActiveFromRatios();
      },
      { root: null, rootMargin: '-15% 0px -60% 0px', threshold: [0, 0.1, 0.2, 0.3, 0.5, 0.7, 1] }
    );

    sectionIds.forEach(function (id) {
      var el = document.getElementById(id);
      if (el) observer.observe(el);
    });
  }

  /**
   * Hero cube: subtle rotation from mouse (desktop) or gentle float (mobile).
   * No rotation on hover: prefer reduced motion or touch device.
   */
  function initHeroCube() {
    var heroVisual = document.getElementById('hero-visual');
    var cubeWrap = document.getElementById('hero-cube-wrap');
    if (!heroVisual || !cubeWrap) return;

    var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var hasHover = window.matchMedia('(hover: hover)').matches;
    var isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    if (prefersReducedMotion || !hasHover || isTouch) {
      heroVisual.classList.add('is-float');
      return;
    }

    var currentX = 0;
    var currentY = 0;
    var targetX = 0;
    var targetY = 0;
    var maxRot = 8;
    var ease = 0.08;
    var rafId = null;

    function lerp(a, b, t) {
      return a + (b - a) * t;
    }

    var idleThreshold = 0.02;

    function updateTransform() {
      rafId = null;
      currentX = lerp(currentX, targetX, ease);
      currentY = lerp(currentY, targetY, ease);
      cubeWrap.style.transform = 'rotateX(' + currentY + 'deg) rotateY(' + currentX + 'deg)';
      var dx = Math.abs(targetX - currentX);
      var dy = Math.abs(targetY - currentY);
      if (dx > idleThreshold || dy > idleThreshold) {
        rafId = requestAnimationFrame(updateTransform);
      }
    }

    function onMouseMove(e) {
      var rect = heroVisual.getBoundingClientRect();
      var x = (e.clientX - rect.left) / rect.width;
      var y = (e.clientY - rect.top) / rect.height;
      targetX = (x - 0.5) * 2 * maxRot;
      targetY = (y - 0.5) * 2 * -maxRot;
      if (!rafId) rafId = requestAnimationFrame(updateTransform);
    }

    function onMouseLeave() {
      targetX = 0;
      targetY = 0;
      if (!rafId) rafId = requestAnimationFrame(updateTransform);
    }

    heroVisual.addEventListener('mousemove', onMouseMove, { passive: true });
    heroVisual.addEventListener('mouseleave', onMouseLeave);
  }

  /**
   * Scroll reveal: add .visible when .reveal elements enter viewport (once).
   * Uses IntersectionObserver; no libraries.
   */
  function initReveal() {
    var revealEls = document.querySelectorAll('.reveal');
    if (revealEls.length === 0) return;

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        });
      },
      { root: null, rootMargin: '0px 0px -40px 0px', threshold: 0.1 }
    );

    revealEls.forEach(function (el) {
      observer.observe(el);
    });
  }

  /**
   * Dark mode toggle: switch body.dark-mode, persist in localStorage.
   */
  function initThemeToggle() {
    var toggle = document.getElementById('theme-toggle');
    var body = document.body;
    if (!toggle || !body) return;

    function savePreference(isDark) {
      try {
        localStorage.setItem('darkMode', isDark ? 'true' : 'false');
      } catch (e) {}
    }

    function updateLabel() {
      var isDark = body.classList.contains('dark-mode');
      toggle.setAttribute('aria-label', isDark ? 'Toggle light mode' : 'Toggle dark mode');
    }

    function updateThemeColor() {
      var meta = document.getElementById('theme-color-meta');
      if (meta) meta.setAttribute('content', body.classList.contains('dark-mode') ? '#0f172a' : '#1d4ed8');
    }

    toggle.addEventListener('click', function () {
      body.classList.toggle('dark-mode');
      savePreference(body.classList.contains('dark-mode'));
      updateLabel();
      updateThemeColor();
    });

    updateLabel();
    updateThemeColor();
  }

  initSmoothScroll();
  initMobileNav();
  initStickyHeader();
  initNavActiveState();
  initHeroCube();
  initReveal();
  initThemeToggle();
})();
