export function initSearching(searchField) {
  return (query, state) => {
    const value = state[searchField];

    if (!value) return query;

    // при новом поиске логично возвращаться на 1 страницу
    return Object.assign({}, query, { search: value, page: 1 });
  };
}