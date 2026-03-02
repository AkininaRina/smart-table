import { getPages } from "../lib/utils.js";

export const initPagination = (
  { pages, fromRow, toRow, totalRows },
  createPage
) => {
  // шаблон кнопки страницы
  const pageTemplate = pages.firstElementChild.cloneNode(true);
  pages.firstElementChild.remove();

  let pageCount = 1;

  // 1) ДО запроса:
  const applyPagination = (query, state, action) => {
    const limit = state.rowsPerPage || 10;
    let page = state.page || 1;

    // обработка кнопок
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

  // 2) ПОСЛЕ запроса: 
  const updatePagination = (total, { page, limit }) => {
    pageCount = Math.ceil(total / limit);

    const visiblePages = getPages(page, pageCount, 5);

    pages.replaceChildren(
      ...visiblePages.map((pageNumber) => {
        const el = pageTemplate.cloneNode(true);
        return createPage(el, pageNumber, pageNumber === page);
      })
    );

    // обновляем
    fromRow.textContent = total === 0 ? 0 : (page - 1) * limit + 1;
    toRow.textContent = Math.min(page * limit, total);
    totalRows.textContent = total;
  };

  return {
    applyPagination,
    updatePagination,
  };
};