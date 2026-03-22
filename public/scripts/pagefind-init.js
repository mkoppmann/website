const searchElement = document.getElementById("search");

if (searchElement) {
  const initializePagefind = async () => {
    await import("/pagefind/pagefind-ui.js");

    if (window.PagefindUI) {
      const pagefindUi = new window.PagefindUI({
        element: "#search",
        showImages: false,
        showSubResults: true,
      });

      const initialQuery = new URLSearchParams(window.location.search).get("q");

      if (initialQuery) {
        pagefindUi.triggerSearch(initialQuery);
      }
    }
  };

  initializePagefind().catch((error) => {
    console.error("Failed to initialize Pagefind:", error);
  });
}