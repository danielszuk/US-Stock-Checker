import { FINNHUB_TOKEN } from "../env";

function fetchFinnhub<Response>(path: string) {
  return fetch(`https://finnhub.io/api/v1/${path}&token=${FINNHUB_TOKEN}`).then(
    async (rawResponse) => {
      const response = await rawResponse.json();
      if (response.error) throw new Error(response.error);
      else return response as Response;
    }
  );
}

// ref: https://finnhub.io/docs/api/stock-symbols
export async function stockSymbolsQuery() {
  return fetchFinnhub<Array<StockSymbolsQuery>>(`stock/symbol?exchange=US`);
}
export interface StockSymbolsQuery {
  currency: string; // e.g. USD
  description: string; // e.g. APPLE INC
  displaySymbol: string; // e.g. AAPL
  figi: string; // e.g. BBG000B9Y5X2
  mic: string; // e.g. XNGS
  symbol: string; // e.g. AAPL
  type: string; // e.g. Common Stock
}
