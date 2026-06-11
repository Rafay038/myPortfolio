/**
 * Theme toggling logic for the portfolio site.
 *
 * Exports pure functions so they can be unit-tested independently of the DOM
 * entry-point in script.js.
 */

function getNextTheme(currentTheme) {
  return currentTheme === "dark" ? "light" : "dark";
}

function buttonLabel(theme) {
  return theme === "dark" ? "Light Mode" : "Dark Mode";
}

function applyTheme(html, theme) {
  html.setAttribute("data-theme", theme);
}

function persistTheme(storage, theme) {
  storage.setItem("theme", theme);
}

function loadSavedTheme(storage) {
  return storage.getItem("theme");
}

function initTheme(html, button, storage) {
  var saved = loadSavedTheme(storage);
  if (saved) {
    applyTheme(html, saved);
    button.textContent = buttonLabel(saved);
  }

  button.addEventListener("click", function () {
    var current = html.getAttribute("data-theme");
    var next = getNextTheme(current);
    applyTheme(html, next);
    persistTheme(storage, next);
    button.textContent = buttonLabel(next);
  });
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    getNextTheme: getNextTheme,
    buttonLabel: buttonLabel,
    applyTheme: applyTheme,
    persistTheme: persistTheme,
    loadSavedTheme: loadSavedTheme,
    initTheme: initTheme,
  };
}
