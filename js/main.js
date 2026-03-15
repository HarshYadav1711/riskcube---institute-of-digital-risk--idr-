/**
 * RiskCube — Institute of Digital Risk
 * Vanilla JS: smooth scroll, mobile nav toggle.
 * Site remains usable without JS (anchor navigation still works).
 */

(function () {
  'use strict';

  var nav = document.getElementById('site-nav');
  var toggle = document.querySelector('.nav-toggle');
  var navLinks = document.querySelectorAll('.site-nav__link');

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
   * Open mobile nav: show menu, update aria-expanded, trap focus optionally.
   */
  function openNav() {
    if (!nav || !toggle) return;
    nav.classList.add('is-open');
    toggle.setAttribute('aria-expanded', 'true');
  }

  /**
   * Close mobile nav: hide menu, update aria-expanded.
   */
  function closeNav() {
    if (!nav || !toggle) return;
    nav.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
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

  function initMobileNav() {
    if (!toggle) return;

    toggle.addEventListener('click', handleToggleClick);
    document.addEventListener('keydown', handleKeydown);
    document.addEventListener('click', handleClickOutside);
  }

  initSmoothScroll();
  initMobileNav();
})();
