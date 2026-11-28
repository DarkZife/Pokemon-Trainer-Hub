import { initializeNavigation } from "./components/nav.js";
import headerHtml from "../../pages/partials/part-header.html?raw";
import footerHtml from "../../pages/partials/part-footer.html?raw";

// Shared header and footer
const headerContainer = document.querySelector("#site-header");
const footerContainer = document.querySelector("#site-footer");

if (headerContainer) {
  const currentPage = headerContainer.dataset.page;
  headerContainer.innerHTML = headerHtml;

  // Highlight the current page in the navigation
  for (const link of headerContainer.querySelectorAll("a[data-page]")) {
    if (link.dataset.page === currentPage) {
      link.setAttribute("aria-current", "page");
    }
  }
}

if (footerContainer) {
  footerContainer.innerHTML = footerHtml;
}

// Start the mobile menu after the header loads
initializeNavigation();
