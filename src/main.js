import "./fonts/ys-display/fonts.css";
import "./style.css";

import { initData } from "./data.js";
import { processFormData } from "./lib/utils.js";

import { initTable } from "./components/table.js";
import { initPagination } from "./components/pagination.js";
import { initSorting } from "./components/sorting.js";
import { initFiltering } from "./components/filtering.js";
import { initSearching } from "./components/searching.js";

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

const applySearching = initSearching("search");

const { applyFiltering, updateIndexes } = initFiltering(sampleTable.filter.elements);

const applySorting = initSorting([
  sampleTable.header.elements.sortByDate,
  sampleTable.header.elements.sortByTotal,
]);

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

function collectState() {
  const state = processFormData(new FormData(sampleTable.container));

  const rowsPerPageRaw = parseInt(state.rowsPerPage);
  const pageRaw = parseInt(state.page ?? 1);

  const rowsPerPage = Number.isFinite(rowsPerPageRaw) ? rowsPerPageRaw : 10;
  const page = Number.isFinite(pageRaw) ? pageRaw : 1;

  return { ...state, rowsPerPage, page };
}

async function render(action) {
  // IMPORTANT: берём реальную submit-кнопку
  action = action?.submitter ?? action;

  const state = collectState();

  let query = {};
  query = applySearching(query, state, action);
  query = applyFiltering(query, state, action);
  query = applySorting(query, state, action);
  query = applyPagination(query, state, action);

  const { total, items } = await api.getRecords(query);

  updatePagination(total, query);
  sampleTable.render(items);
}

async function init() {
  const indexes = await api.getIndexes();

  updateIndexes(sampleTable.filter.elements, {
    searchBySeller: indexes.sellers,
  });
}

const appRoot = document.querySelector("#app");
appRoot.appendChild(sampleTable.container);

init().then(render);