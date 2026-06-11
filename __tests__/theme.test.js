/**
 * @jest-environment jsdom
 */

const {
  getNextTheme,
  buttonLabel,
  applyTheme,
  persistTheme,
  loadSavedTheme,
  initTheme,
} = require("../theme");

// ---------------------------------------------------------------------------
// Pure function tests
// ---------------------------------------------------------------------------

describe("getNextTheme", () => {
  it("should return 'light' when current theme is 'dark'", () => {
    expect(getNextTheme("dark")).toBe("light");
  });

  it("should return 'dark' when current theme is 'light'", () => {
    expect(getNextTheme("light")).toBe("dark");
  });

  it("should return 'dark' for any non-dark value", () => {
    expect(getNextTheme("")).toBe("dark");
    expect(getNextTheme(null)).toBe("dark");
    expect(getNextTheme(undefined)).toBe("dark");
  });
});

describe("buttonLabel", () => {
  it("should return 'Light Mode' for dark theme", () => {
    expect(buttonLabel("dark")).toBe("Light Mode");
  });

  it("should return 'Dark Mode' for light theme", () => {
    expect(buttonLabel("light")).toBe("Dark Mode");
  });

  it("should return 'Dark Mode' for any non-dark value", () => {
    expect(buttonLabel("")).toBe("Dark Mode");
    expect(buttonLabel(null)).toBe("Dark Mode");
  });
});

// ---------------------------------------------------------------------------
// DOM helpers
// ---------------------------------------------------------------------------

describe("applyTheme", () => {
  it("should set the data-theme attribute on the given element", () => {
    const el = document.createElement("html");
    applyTheme(el, "dark");
    expect(el.getAttribute("data-theme")).toBe("dark");
  });

  it("should overwrite an existing data-theme value", () => {
    const el = document.createElement("html");
    el.setAttribute("data-theme", "light");
    applyTheme(el, "dark");
    expect(el.getAttribute("data-theme")).toBe("dark");
  });
});

describe("persistTheme", () => {
  beforeEach(() => localStorage.clear());

  it("should store the theme in the provided storage", () => {
    persistTheme(localStorage, "dark");
    expect(localStorage.getItem("theme")).toBe("dark");
  });

  it("should overwrite a previously stored theme", () => {
    persistTheme(localStorage, "dark");
    persistTheme(localStorage, "light");
    expect(localStorage.getItem("theme")).toBe("light");
  });
});

describe("loadSavedTheme", () => {
  beforeEach(() => localStorage.clear());

  it("should return null when no theme is saved", () => {
    expect(loadSavedTheme(localStorage)).toBeNull();
  });

  it("should return the saved theme value", () => {
    localStorage.setItem("theme", "dark");
    expect(loadSavedTheme(localStorage)).toBe("dark");
  });
});

// ---------------------------------------------------------------------------
// Integration: initTheme
// ---------------------------------------------------------------------------

describe("initTheme", () => {
  let html;
  let button;

  beforeEach(() => {
    localStorage.clear();
    html = document.createElement("html");
    html.setAttribute("data-theme", "light");
    button = document.createElement("button");
    button.textContent = "Dark Mode";
  });

  it("should apply saved dark theme on init", () => {
    localStorage.setItem("theme", "dark");
    initTheme(html, button, localStorage);

    expect(html.getAttribute("data-theme")).toBe("dark");
    expect(button.textContent).toBe("Light Mode");
  });

  it("should keep default light theme when nothing is saved", () => {
    initTheme(html, button, localStorage);

    expect(html.getAttribute("data-theme")).toBe("light");
    expect(button.textContent).toBe("Dark Mode");
  });

  it("should toggle from light to dark on click", () => {
    initTheme(html, button, localStorage);
    button.click();

    expect(html.getAttribute("data-theme")).toBe("dark");
    expect(button.textContent).toBe("Light Mode");
    expect(localStorage.getItem("theme")).toBe("dark");
  });

  it("should toggle from dark back to light on double click", () => {
    initTheme(html, button, localStorage);
    button.click();
    button.click();

    expect(html.getAttribute("data-theme")).toBe("light");
    expect(button.textContent).toBe("Dark Mode");
    expect(localStorage.getItem("theme")).toBe("light");
  });

  it("should persist theme across simulated page reloads", () => {
    initTheme(html, button, localStorage);
    button.click();
    expect(localStorage.getItem("theme")).toBe("dark");

    // Simulate a fresh page load with new DOM elements
    const html2 = document.createElement("html");
    html2.setAttribute("data-theme", "light");
    const button2 = document.createElement("button");
    button2.textContent = "Dark Mode";

    initTheme(html2, button2, localStorage);

    expect(html2.getAttribute("data-theme")).toBe("dark");
    expect(button2.textContent).toBe("Light Mode");
  });

  it("should toggle correctly after restoring a saved theme", () => {
    localStorage.setItem("theme", "dark");
    initTheme(html, button, localStorage);

    // Toggle: dark -> light
    button.click();
    expect(html.getAttribute("data-theme")).toBe("light");
    expect(button.textContent).toBe("Dark Mode");
    expect(localStorage.getItem("theme")).toBe("light");
  });
});
