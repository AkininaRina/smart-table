import { sortMap, sortOrderMap } from "../lib/sort.js";

export function initSorting(columns) {
  const setButtonValue = (btn, value) => {
    btn.dataset.value = value;
  };

  const getButtonValue = (btn) => btn.dataset.value || "none";

  const resetOthers = (activeBtn) => {
    columns.forEach((btn) => {
      if (!btn || btn === activeBtn) return;
      setButtonValue(btn, "none");
    });
  };

  return (query, state, action) => {
    let nextQuery = query;

    // клик по сортировке: переключаем состояние
    if (action && action.name === "sort") {
      const current = getButtonValue(action);
      const next = sortOrderMap[current] || "none";
      setButtonValue(action, next);
      resetOthers(action);

      // при смене сортировки логично сбрасывать страницу
      nextQuery = Object.assign({}, nextQuery, { page: 1 });
    }

    // вычисляем активную сортировку (уже с учётом возможного клика)
    const active = columns.find((btn) => btn && getButtonValue(btn) !== "none");
    if (!active) return nextQuery;

    const order = getButtonValue(active); // up/down
    const field = sortMap[active.dataset.name]; // date/total
    const sort = field && order !== "none" ? `${field}:${order}` : null;

    return sort ? Object.assign({}, nextQuery, { sort }) : nextQuery;
  };
}
