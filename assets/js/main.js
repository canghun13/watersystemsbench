const getPath = () => window.location.pathname.replace(/index\.html$/, "");

function setCurrentNav() {
  const path = getPath();
  document.querySelectorAll(".primary-nav a").forEach((link) => {
    const target = new URL(link.href, window.location.origin).pathname;
    const active = target === "/" ? path === "/" : path.startsWith(target);
    if (active) link.setAttribute("aria-current", "page");
  });
  if (path.startsWith("/systems/")) document.querySelector(".systems-menu > summary")?.setAttribute("aria-current", "page");
}

function setupMenu() {
  const button = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".primary-nav");
  if (!button || !nav) return;
  let previousFocus = null;
  const close = ({ restore = false } = {}) => {
    nav.classList.remove("is-open");
    button.setAttribute("aria-expanded", "false");
    nav.querySelector(".systems-menu")?.removeAttribute("open");
    if (restore && previousFocus) previousFocus.focus();
  };
  const open = () => {
    previousFocus = document.activeElement;
    nav.classList.add("is-open");
    button.setAttribute("aria-expanded", "true");
    nav.querySelector("a")?.focus();
  };
  button.addEventListener("click", () => button.getAttribute("aria-expanded") === "true" ? close() : open());
  nav.addEventListener("click", (event) => { if (event.target.closest("a")) close(); });
  document.addEventListener("keydown", (event) => { if (event.key === "Escape" && nav.classList.contains("is-open")) close({ restore: true }); });
  document.addEventListener("click", (event) => { if (nav.classList.contains("is-open") && !nav.contains(event.target) && !button.contains(event.target)) close(); });
}

window.addEventListener("partials:ready", () => {
  setCurrentNav();
  setupMenu();
});
