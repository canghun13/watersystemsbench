const finder = document.querySelector("[data-tool-finder]");

if (finder) {
  const form = finder.querySelector("[data-tool-filters]");
  const search = finder.querySelector("[data-tool-search]");
  const system = finder.querySelector("[data-tool-system]");
  const type = finder.querySelector("[data-tool-type]");
  const count = finder.querySelector("[data-tool-count]");
  const empty = finder.querySelector("[data-tool-empty]");
  const cards = [...finder.querySelectorAll("[data-tool-card]")];

  const normalize = (value) => value.trim().toLocaleLowerCase("en");

  const update = () => {
    const query = normalize(search.value);
    let visible = 0;

    cards.forEach((card) => {
      const matchesQuery = !query || card.dataset.search.includes(query);
      const matchesSystem = system.value === "all" || card.dataset.system === system.value;
      const matchesType = type.value === "all" || card.dataset.type === type.value;
      const matches = matchesQuery && matchesSystem && matchesType;
      card.hidden = !matches;
      if (matches) visible += 1;
    });

    count.textContent = visible === cards.length ? `Showing all ${cards.length} tools.` : `Showing ${visible} of ${cards.length} tools.`;
    empty.hidden = visible !== 0;
  };

  form.addEventListener("input", update);
  form.addEventListener("change", update);
  form.addEventListener("reset", () => queueMicrotask(update));
}
