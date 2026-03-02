import "./fonts/ys-display/fonts.css";
import "./style.css";

import { initData } from "./data.js";
import { processFormData } from "./lib/utils.js";

import { initTable } from "./components/table.js";
// В этом шаге компоненты поиска/сортировки/фильтра/пагинации пока не подключаем в работу.
// Их можно оставить импортами, но не использовать:
import { initPagination } from "./components/pagination.js";
// import { initSorting } from "./components/sorting.js";
// import { initFiltering } from "./components/filtering.js";
// import { initSearching } from "./components/searching.js";

const api = initData();

const sampleTable = initTable(
  {
    tableTemplate: "table",
    rowTemplate: "row",
    before: ["search", "header", "filter"],
    after: ["pagination"],
  },
  render
);

const { applyPagination, updatePagination } = initPagination(
  sampleTable.pagination.elements,
  (el, page, isCurrent) => {
    const input = el.querySelector("input");
    const label = el.querySelector("span");
    input.value = page;
    input.checked = isCurrent;
    label.textContent = page;
    return el;
  }
);

/**
 * Сбор и обработка полей из таблицы
 * @returns {Object}
 */
function collectState() {
  const state = processFormData(new FormData(sampleTable.container));

  const rowsPerPage = parseInt(state.rowsPerPage);
  const page = parseInt(state.page ?? 1);

  return {
    ...state,
    rowsPerPage,
    page,
  };
}

/**
 * Перерисовка состояния таблицы при любых изменениях
 */
async function render(action) {
  const state = collectState();

  let query = {};
  query = applyPagination(query, state, action);

  const { total, items } = await api.getRecords(query);

  updatePagination(total, query);

  sampleTable.render(items);
}

/**
 * Инициализация: сначала получаем индексы (продавцы/покупатели),
 * потом можно делать рендер таблицы
 */
async function init() {
  await api.getIndexes();
}

const appRoot = document.querySelector("#app");
appRoot.appendChild(sampleTable.container);

init().then(render);