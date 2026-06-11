/*
 * Entry point – wires the theme module to the real DOM / localStorage.
 *
 * In the browser <script src="theme.js"> is loaded first, making the
 * helpers available on `window`.  In Node (tests) the file is required
 * via CommonJS instead.
 */

/* global initTheme */
(function () {
  var btn = document.getElementById("themeToggle");
  var html = document.documentElement;
  initTheme(html, btn, localStorage);
})();