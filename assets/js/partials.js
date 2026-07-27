async function injectPartial(selector, path) {
  const target = document.querySelector(selector);
  if (!target) return;
  try {
    const response = await fetch(path);
    if (!response.ok) throw new Error(`${response.status} ${path}`);
    target.outerHTML = await response.text();
  } catch (error) {
    console.error("Partial loading failed", error);
    target.innerHTML = `<p class="notice">Navigation could not be loaded. <a href="/">Return home</a>.</p>`;
  }
}

await Promise.all([
  injectPartial("[data-header-slot]", "/partials/header.html"),
  injectPartial("[data-footer-slot]", "/partials/footer.html")
]);
window.dispatchEvent(new CustomEvent("partials:ready"));
