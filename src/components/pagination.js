import { getPages } from "../lib/utils.js";

export const initPagination = ({ pages, fromRow, toRow, totalRows }, createPage) => {
  const pageTemplate = pages.firstElementChild.cloneNode(true);
  pages.firstElementChild.remove();

  let pageCount = 1;

  const applyPagination = (query, state, action) => {
    const limitRaw = state.rowsPerPage;
    const limit = Number.isFinite(limitRaw) ? limitRaw : 10;

    let page = Number.isFinite(state.page) ? state.page : 1;

    if (action) {
      switch (action.name) {
        case "prev":
          page = Math.max(1, page - 1);
          break;
        case "next":
          page = Math.min(pageCount, page + 1);
          break;
        case "first":
          page = 1;
          break;
        case "last":
          page = pageCount;
          break;
      }
    }

    return Object.assign({}, query, { limit, page });
  };

  const updatePagination = (total, { page, limit }) => {
    pageCount = Math.max(1, Math.ceil(total / limit));

    const visiblePages = getPages(page, pageCount, 5);

    pages.replaceChildren(
      ...visiblePages.map((pageNumber) => {
        const el = pageTemplate.cloneNode(true);
        return createPage(el, pageNumber, pageNumber === page);
      })
    );

    fromRow.textContent = total === 0 ? 0 : (page - 1) * limit + 1;
    toRow.textContent = Math.min(page * limit, total);
    totalRows.textContent = total;
  };

  return { applyPagination, updatePagination };
};