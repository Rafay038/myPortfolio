/**
 * @jest-environment jsdom
 */

const fs = require("fs");
const path = require("path");

const html = fs.readFileSync(
  path.resolve(__dirname, "../index.html"),
  "utf-8"
);

let doc;

beforeEach(() => {
  doc = new DOMParser().parseFromString(html, "text/html");
});

// ---------------------------------------------------------------------------
// Meta & head
// ---------------------------------------------------------------------------

describe("Page meta information", () => {
  it("should have a <title> containing the portfolio owner name", () => {
    expect(doc.title).toContain("Rafay Ahmed");
  });

  it("should set charset to UTF-8", () => {
    const meta = doc.querySelector('meta[charset="UTF-8"]');
    expect(meta).not.toBeNull();
  });

  it("should include a responsive viewport meta tag", () => {
    const meta = doc.querySelector('meta[name="viewport"]');
    expect(meta).not.toBeNull();
    expect(meta.getAttribute("content")).toContain("width=device-width");
  });

  it("should link to styles.css", () => {
    const link = doc.querySelector('link[rel="stylesheet"]');
    expect(link).not.toBeNull();
    expect(link.getAttribute("href")).toBe("styles.css");
  });
});

// ---------------------------------------------------------------------------
// Navigation
// ---------------------------------------------------------------------------

describe("Navigation", () => {
  it("should contain the logo link", () => {
    const logo = doc.querySelector(".navbar .logo");
    expect(logo).not.toBeNull();
    expect(logo.textContent).toContain("Rafay Ahmed");
  });

  it("should have navigation links for main sections", () => {
    const links = doc.querySelectorAll(".nav-links a");
    const hrefs = Array.from(links).map((a) => a.getAttribute("href"));

    expect(hrefs).toContain("#about");
    expect(hrefs).toContain("#projects");
    expect(hrefs).toContain("#certifications");
    expect(hrefs).toContain("#contact");
  });

  it("should link the resume in the nav", () => {
    const resumeLink = doc.querySelector('.nav-links a[href="Resume.pdf"]');
    expect(resumeLink).not.toBeNull();
    expect(resumeLink.getAttribute("target")).toBe("_blank");
  });

  it("should have a theme toggle button", () => {
    const btn = doc.getElementById("themeToggle");
    expect(btn).not.toBeNull();
    expect(btn.textContent.trim()).toBe("Dark Mode");
  });
});

// ---------------------------------------------------------------------------
// Hero section
// ---------------------------------------------------------------------------

describe("Hero section", () => {
  it("should display the hero heading", () => {
    const h1 = doc.querySelector("#home h1");
    expect(h1).not.toBeNull();
    expect(h1.textContent).toContain("Rafay Ahmed");
  });

  it("should have a call-to-action to view resume", () => {
    const cta = doc.querySelector('#home a[href="Resume.pdf"]');
    expect(cta).not.toBeNull();
  });

  it("should have a call-to-action to view projects", () => {
    const cta = doc.querySelector('#home a[href="#projects"]');
    expect(cta).not.toBeNull();
  });
});

// ---------------------------------------------------------------------------
// Sections existence
// ---------------------------------------------------------------------------

describe("Main sections", () => {
  it("should have an About section", () => {
    const section = doc.querySelector("#about");
    expect(section).not.toBeNull();
    expect(section.querySelector("h2").textContent).toBe("About Me");
  });

  it("should have a Projects section with project cards", () => {
    const section = doc.querySelector("#projects");
    expect(section).not.toBeNull();
    const cards = section.querySelectorAll(".card");
    expect(cards.length).toBeGreaterThanOrEqual(1);
  });

  it("should have a Certifications section", () => {
    const section = doc.querySelector("#certifications");
    expect(section).not.toBeNull();
    expect(section.querySelector("h2").textContent).toBe("Certifications");
  });

  it("should have a Contact section", () => {
    const section = doc.querySelector("#contact");
    expect(section).not.toBeNull();
    expect(section.querySelector("h2").textContent).toBe("Contact");
  });

  it("should have a Skills section with skill tags", () => {
    const skills = doc.querySelectorAll(".skills span");
    expect(skills.length).toBeGreaterThanOrEqual(5);
  });
});

// ---------------------------------------------------------------------------
// Projects
// ---------------------------------------------------------------------------

describe("Project cards", () => {
  it("each project card should have a title and GitHub link", () => {
    const cards = doc.querySelectorAll("#projects .card");
    cards.forEach((card) => {
      expect(card.querySelector("h3")).not.toBeNull();
      const link = card.querySelector('a[href*="github.com"]');
      expect(link).not.toBeNull();
      expect(link.getAttribute("target")).toBe("_blank");
      expect(link.getAttribute("rel")).toContain("noopener");
    });
  });
});

// ---------------------------------------------------------------------------
// Contact
// ---------------------------------------------------------------------------

describe("Contact section", () => {
  it("should have an email link", () => {
    const mailto = doc.querySelector('#contact a[href^="mailto:"]');
    expect(mailto).not.toBeNull();
  });

  it("should have a LinkedIn link", () => {
    const linkedin = doc.querySelector(
      '#contact a[href*="linkedin.com"]'
    );
    expect(linkedin).not.toBeNull();
  });

  it("should have a GitHub profile link", () => {
    const github = doc.querySelector(
      '#contact a[href*="github.com"]'
    );
    expect(github).not.toBeNull();
  });
});

// ---------------------------------------------------------------------------
// Footer
// ---------------------------------------------------------------------------

describe("Footer", () => {
  it("should contain a copyright notice", () => {
    const footer = doc.querySelector("footer");
    expect(footer).not.toBeNull();
    expect(footer.textContent).toContain("Rafay Ahmed");
  });
});

// ---------------------------------------------------------------------------
// Accessibility basics
// ---------------------------------------------------------------------------

describe("Accessibility", () => {
  it("should set lang attribute on <html>", () => {
    const htmlEl = doc.documentElement;
    expect(htmlEl.getAttribute("lang")).toBe("en");
  });

  it("should have a default data-theme of light", () => {
    const htmlEl = doc.documentElement;
    expect(htmlEl.getAttribute("data-theme")).toBe("light");
  });

  it("should load theme.js before script.js", () => {
    const scripts = doc.querySelectorAll("script[src]");
    const srcs = Array.from(scripts).map((s) => s.getAttribute("src"));
    const themeIdx = srcs.indexOf("theme.js");
    const scriptIdx = srcs.indexOf("script.js");
    expect(themeIdx).toBeGreaterThanOrEqual(0);
    expect(scriptIdx).toBeGreaterThan(themeIdx);
  });

  it("all external links should open in a new tab", () => {
    const external = doc.querySelectorAll('a[href^="http"]');
    external.forEach((a) => {
      expect(a.getAttribute("target")).toBe("_blank");
    });
  });
});
