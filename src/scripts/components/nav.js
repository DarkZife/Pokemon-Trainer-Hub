// Mobile menu controls
export function initializeNavigation() {
  const toggle = document.querySelector(".menu-toggle");
  const navigation = document.querySelector("#primary-nav");
  if (!toggle || !navigation) return;

  toggle.hidden = false;
  navigation.dataset.collapsible = "true";

  function closeMenu() {
    toggle.setAttribute("aria-expanded", "false");
    navigation.classList.remove("is-open");
  }

  toggle.addEventListener("click", () => {
    const isOpen = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!isOpen));
    navigation.classList.toggle("is-open", !isOpen);
  });

  navigation.addEventListener("click", (event) => {
    if (event.target.closest("a")) closeMenu();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
      closeMenu();
      toggle.focus();
    }
  });
}
