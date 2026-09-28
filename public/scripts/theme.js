(() => {
  const storageKey = "theme";
  const themes = ["system", "light", "dark"];
  const root = document.documentElement;
  let theme = "system";

  try {
    const stored = localStorage.getItem(storageKey);
    if (stored === "light" || stored === "dark") theme = stored;
  } catch {
    // The switch remains usable when storage is unavailable.
  }

  if (theme !== "system") root.dataset.theme = theme;

  document.addEventListener("DOMContentLoaded", () => {
    const button = document.querySelector("[data-theme-toggle]");
    if (!button) return;

    const updateLabel = () => {
      const next = themes[(themes.indexOf(theme) + 1) % themes.length];
      const label = `Theme: ${theme}. Switch to ${next}.`;
      button.setAttribute("aria-label", label);
      button.setAttribute("title", label);
    };

    updateLabel();
    button.addEventListener("click", () => {
      theme = themes[(themes.indexOf(theme) + 1) % themes.length];
      if (theme === "system") delete root.dataset.theme;
      else root.dataset.theme = theme;

      try {
        if (theme === "system") localStorage.removeItem(storageKey);
        else localStorage.setItem(storageKey, theme);
      } catch {
        // Keep the current page preference even without storage.
      }

      updateLabel();
    });
  });
})();
