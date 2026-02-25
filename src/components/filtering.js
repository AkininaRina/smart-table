import { createComparison, defaultRules } from "../lib/compare.js";

// @todo: #4.3 — настроить компаратор
const compare = createComparison(defaultRules);

export function initFiltering(elements, indexes) {
  // @todo: #4.1 — заполнить выпадающие списки опциями

  Object.keys(indexes).forEach((elementName) => {
    elements[elementName].append(
      ...Object.values(indexes[elementName]).map((name) => {
        const option = document.createElement("option");
        option.value = name;
        option.textContent = name;
        return option;
      }),
    );
  });

  return (data, state, action) => {
    // @todo: #4.2 — обработать очистку поля
    if (action && action.name === "clear") {
      const wrapper = action.parentElement;
      const input = wrapper.querySelector("input");

      if (input) {
        input.value = "";
      }

      const field = action.dataset.field;
      if (field && field in state) {
        state[field] = "";
      }
    }
    // @todo: #4.5 — отфильтровать данные используя компаратор
    const filters = {
      date: state.date,
      customer: state.customer,
      seller: state.seller,
      total: [
        state.totalFrom ? Number(state.totalFrom) : null,
        state.totalTo ? Number(state.totalTo) : null,
      ],
    };

    // return data.filter(row => compare(row, state));
    const totalFrom =
      state.totalFrom === "" || state.totalFrom == null
        ? undefined
        : Number(state.totalFrom);
    const totalTo =
      state.totalTo === "" || state.totalTo == null
        ? undefined
        : Number(state.totalTo);

    const nextState = {
      ...state,
      total: [totalFrom, totalTo],
    };

    delete nextState.totalFrom;
    delete nextState.totalTo;

    return data.filter((row) => compare(row, nextState));
  };
}
