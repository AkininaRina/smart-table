export function initSorting(columns) {
  let field = null;        // "date" | "total"
  let uiOrder = "none";    // "none" | "up" | "down"

  const toggle = (current) => {
    if (current === "none") return "up";
    if (current === "up") return "down";
    return "none";
  };

  const fieldMap = {
    date: "date",
    total: "total",
  };

  const syncUI = () => {
    columns.forEach((btn) => {
      if (!btn) return;
      const btnField = btn.dataset.field;
      btn.dataset.value = btnField === field ? uiOrder : "none";
    });
  };

  return (query, state, action) => {
    if (action && action.name === "sort") {
      const clickedField = action.dataset.field;
      if (clickedField) {
        if (field === clickedField) uiOrder = toggle(uiOrder);
        else {
          field = clickedField;
          uiOrder = "up";
        }
        if (uiOrder === "none") field = null;
        syncUI();
      }
    }

    if (!field || uiOrder === "none") return query;

    const serverField = fieldMap[field];
    if (!serverField) return query;

    return Object.assign({}, query, {
      sort: `${serverField}:${uiOrder}`, // <-- up/down
      page: 1,
    });
  };
}