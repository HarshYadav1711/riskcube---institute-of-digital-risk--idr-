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

  initSmoothScroll();
  initMobileNav();
  initStickyHeader();
})();
