const searchElement = document.getElementById("search");

if (searchElement) {
  const initializePagefind = async () => {
    await import("/pagefind/pagefind-ui.js");

    if (window.PagefindUI) {
      new window.PagefindUI({
        element: "#search",
        showSubResults: true,
      });
    }
  };

  initializePagefind().catch((error) => {
    console.error("Failed to initialize Pagefind:", error);
  });
}