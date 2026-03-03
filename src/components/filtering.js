export function initFiltering(elements) {
  const updateIndexes = (elements, indexes) => {
    Object.keys(indexes).forEach((elementName) => {
      const el = elements[elementName];
      if (!el) return;

      el.querySelectorAll("option:not([value=''])").forEach((o) => o.remove());

      Object.values(indexes[elementName]).forEach((name) => {
        const option = document.createElement("option");
        option.textContent = name;
        option.value = name;
        el.append(option);
      });
    });
  };

  const applyFiltering = (query, state, action) => {
    // сброс фильтров 
    if (action && action.name === "clear") {
      Object.keys(elements).forEach((key) => {
        const el = elements[key];
        if (!el) return;
        if (el.tagName === "INPUT") el.value = "";
        if (el.tagName === "SELECT") el.value = "";
      });
      return Object.assign({}, query, { page: 1 });
    }

    const filter = {};

    Object.keys(elements).forEach((key) => {
      const el = elements[key];
      if (!el) return;

      const isControl = el.tagName === "INPUT" || el.tagName === "SELECT";
      if (!isControl) return;

      if (el.value) {
        filter[`filter[${el.name}]`] = el.value;
      }
    });

    return Object.keys(filter).length
      ? Object.assign({}, query, filter, { page: 1 })
      : query;
  };

  return { updateIndexes, applyFiltering };
}