const BASE_URL = "https://webinars.webdev.education-services.ru/sp7-api";

export function initData() {
  let sellers = null;
  let customers = null;

  async function getIndexes() {

    if (sellers && customers) {
      return { sellers, customers };
    }


    const sellersResponse = await fetch(`${BASE_URL}/sellers`);
    sellers = await sellersResponse.json();

    const customersResponse = await fetch(`${BASE_URL}/customers`);
    customers = await customersResponse.json();

    return { sellers, customers };
  }

  function mapRecords(items) {
    return items.map((item) => {
      return {
        id: item.receipt_id,
        date: item.date,
        seller: sellers[item.seller_id],
        customer: customers[item.customer_id],
        total: item.total_amount,
      };
    });
  }

async function getRecords(query = {}) {
  const params = new URLSearchParams(query).toString();
  console.log(`${BASE_URL}/records?${params}`);

const response = await fetch(`${BASE_URL}/records?${params}`);
if (!response.ok) {
  const text = await response.text();
  throw new Error(`HTTP ${response.status}: ${text}`);
}
const records = await response.json();

  return {
    total: records.total,
    items: mapRecords(records.items),
  };
}
  return {
    getIndexes,
    getRecords,
  };
}