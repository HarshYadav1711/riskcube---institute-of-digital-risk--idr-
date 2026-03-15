/**
 * Apply saved theme before paint to avoid flash. Load as first script in body.
 */
(function () {
  'use strict';
  try {
    if (localStorage.getItem('darkMode') === 'true' && document.body) {
      document.body.classList.add('dark-mode');
    }
  } catch (e) {}
})();
