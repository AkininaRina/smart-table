const BASE_URL = "https://webinars.webdev.education-services.ru/sp7-api";

export function initData() {
  // кеш
  let sellers;
  let customers;
  let lastResult;
  let lastQuery;

  // приводим данные в формат таблицы
  const mapRecords = (data) =>
    data.map((item) => ({
      id: item.receipt_id,
      date: item.date,
      seller: sellers[item.seller_id],
      customer: customers[item.customer_id],
      total: item.total_amount,
    }));

  // индексы
  const getIndexes = async () => {
    if (!sellers || !customers) {
      const [s, c] = await Promise.all([
        fetch(`${BASE_URL}/sellers`).then((res) => res.json()),
        fetch(`${BASE_URL}/customers`).then((res) => res.json()),
      ]);
      sellers = s;
      customers = c;
    }
    return { sellers, customers };
  };

  // записи
  const getRecords = async (query = {}, isUpdated = false) => {
    const qs = new URLSearchParams(query);
    const nextQuery = qs.toString();

    if (lastQuery === nextQuery && !isUpdated) {
      return lastResult;
    }

    const response = await fetch(`${BASE_URL}/records?${nextQuery}`);
    if (!response.ok) {
      const text = await response.text();
      throw new Error(`HTTP ${response.status}: ${text}`);
    }

    const records = await response.json();

    lastQuery = nextQuery;
    lastResult = {
      total: records.total,
      items: mapRecords(records.items),
    };

    return lastResult;
  };

  return { getIndexes, getRecords };
}