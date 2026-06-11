const themeToggle = document.getElementById("themeToggle");
const html = document.documentElement;

if (!themeToggle) {
  console.error("Theme toggle button (#themeToggle) not found in the DOM.");
} else {
  try {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      html.setAttribute("data-theme", savedTheme);
      updateButtonText(savedTheme);
    }
  } catch (e) {
    console.warn("Could not read theme from localStorage:", e);
  }

  themeToggle.addEventListener("click", () => {
    const currentTheme = html.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";

    html.setAttribute("data-theme", newTheme);
    try {
      localStorage.setItem("theme", newTheme);
    } catch (e) {
      console.warn("Could not save theme to localStorage:", e);
    }
    updateButtonText(newTheme);
  });
}

function updateButtonText(theme) {
  if (!themeToggle) return;
  themeToggle.textContent = theme === "dark" ? "Light Mode" : "Dark Mode";
}
