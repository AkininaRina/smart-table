import { data as sourceData } from "./data/dataset_1.js";
import { makeIndex } from "./lib/utils.js";

export function initData() {
  // индексы
  const sellers = makeIndex(
    sourceData.sellers,
    "id",
    (v) => `${v.first_name} ${v.last_name}`
  );
  const customers = makeIndex(
    sourceData.customers,
    "id",
    (v) => `${v.first_name} ${v.last_name}`
  );

  // записи в формате таблицы
  const records = sourceData.purchase_records.map((item) => ({
    id: item.receipt_id,
    date: item.date,
    seller: sellers[item.seller_id],
    customer: customers[item.customer_id],
    total: item.total_amount,
  }));

  const getIndexes = async () => {
    return { sellers, customers };
  };

  const getRecords = async (query = {}) => {
    let items = [...records];

    // search (по всем текстовым полям)
    if (query.search) {
      const s = String(query.search).toLowerCase();
      items = items.filter((r) =>
        `${r.date} ${r.seller} ${r.customer} ${r.total}`.toLowerCase().includes(s)
      );
    }

    // filters: filter[date], filter[customer], filter[seller], filter[totalFrom], filter[totalTo]
    const date = query["filter[date]"];
    const customer = query["filter[customer]"];
    const seller = query["filter[seller]"];
    const totalFrom = query["filter[totalFrom]"];
    const totalTo = query["filter[totalTo]"];

    if (date) items = items.filter((r) => String(r.date).includes(String(date)));
    if (customer)
      items = items.filter((r) =>
        String(r.customer).toLowerCase().includes(String(customer).toLowerCase())
      );
    if (seller) items = items.filter((r) => r.seller === seller);

    if (totalFrom) {
      const n = Number(totalFrom);
      if (!Number.isNaN(n)) items = items.filter((r) => r.total >= n);
    }
    if (totalTo) {
      const n = Number(totalTo);
      if (!Number.isNaN(n)) items = items.filter((r) => r.total <= n);
    }

    // sort: "date:up|down" или "total:up|down"
if (query.sort) {
  const [field, dir] = String(query.sort).split(":");
  const sign = dir === "down" ? -1 : 1;

  items.sort((a, b) => {
    if (field === "date") {
      if (a.date > b.date) return 1 * sign;
      if (a.date < b.date) return -1 * sign;
      return 0; // ВАЖНО: равные даты
    }

    if (field === "total") {
      if (a.total > b.total) return 1 * sign;
      if (a.total < b.total) return -1 * sign;
      return 0; // ВАЖНО: равные суммы
    }

    return 0;
  });
}
    const total = items.length;

    // pagination: limit + page
    const limit = Number(query.limit ?? 10);
    const page = Number(query.page ?? 1);
    const safeLimit = Number.isFinite(limit) && limit > 0 ? limit : 10;
    const safePage = Number.isFinite(page) && page > 0 ? page : 1;

    const start = (safePage - 1) * safeLimit;
    const paged = items.slice(start, start + safeLimit);

    return { total, items: paged };
  };

  return { getIndexes, getRecords };
}