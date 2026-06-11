/**
 * @jest-environment jsdom
 */

describe("script.js (browser entry point)", () => {
  beforeEach(() => {
    localStorage.clear();

    // Set up minimal DOM that script.js expects
    document.documentElement.setAttribute("data-theme", "light");
    document.body.innerHTML = '<button id="themeToggle">Dark Mode</button>';

    // Make theme.js helpers available globally (as the browser <script> would)
    const theme = require("../theme");
    Object.assign(global, theme);

    // Clear module cache so script.js runs fresh each time
    jest.resetModules();
  });

  afterEach(() => {
    // Clean up globals
    delete global.getNextTheme;
    delete global.buttonLabel;
    delete global.applyTheme;
    delete global.persistTheme;
    delete global.loadSavedTheme;
    delete global.initTheme;
  });

  it("should initialise theme on load with no saved preference", () => {
    require("../script");

    expect(document.documentElement.getAttribute("data-theme")).toBe("light");
    expect(document.getElementById("themeToggle").textContent).toBe(
      "Dark Mode"
    );
  });

  it("should restore a previously saved dark theme", () => {
    localStorage.setItem("theme", "dark");
    require("../script");

    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
    expect(document.getElementById("themeToggle").textContent).toBe(
      "Light Mode"
    );
  });

  it("should toggle theme when the button is clicked", () => {
    require("../script");

    document.getElementById("themeToggle").click();

    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
    expect(localStorage.getItem("theme")).toBe("dark");
  });
});
