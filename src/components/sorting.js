import { sortCollection, sortMap } from "../lib/sort.js";

export function initSorting(columns) {
  return (data, state, action) => {
    let field = null;
    let order = "none";

    if (action && action.name === "sort") {
      // #3.1 — запомнить выбранный режим сортировки
      action.dataset.value = sortMap[action.dataset.value ?? "none"];

      field = action.dataset.field;
      order = action.dataset.value;

      // #3.2 — сбросить сортировки остальных колонок
      columns.forEach((btn) => {
        if (btn !== action) btn.dataset.value = "none";
      });
    } else {
      // #3.3 — получить выбранный режим сортировки
      const active = columns.find((btn) => btn.dataset.value !== "none");
      if (active) {
        field = active.dataset.field;
        order = active.dataset.value;
      }
    }

    return sortCollection(data, field, order);
  };
}