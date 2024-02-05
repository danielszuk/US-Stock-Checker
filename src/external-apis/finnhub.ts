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

export enum FinnhubQueryKeys {
  StockSymbols = "FinnhubQueryStockSymbols",
  Quote = "FinnhubQueryQuote",
  CompanyPeers = "FinnhubQueryCompanyPeers",
}

// ref: https://finnhub.io/docs/api/stock-symbols
export async function stockSymbolsQuery() {
  return fetchFinnhub<Array<StockSymbolsQueryItem>>(`stock/symbol?exchange=US`);
}
export interface StockSymbolsQueryItem {
  currency: string; // e.g. USD
  description: string; // e.g. APPLE INC
  displaySymbol: string; // e.g. AAPL
  figi: string; // e.g. BBG000B9Y5X2
  mic: string; // e.g. XNGS
  symbol: string; // e.g. AAPL
  type: string; // e.g. Common Stock
}

// ref: https://finnhub.io/docs/api/quote
export async function quoteQuery(symbol: string) {
  return fetchFinnhub<QuoteQuery>(`quote?symbol=${symbol}`);
}
export interface QuoteQuery {
  c: number;
  h: number;
  l: number;
  o: number;
  pc: number;
  t: number;
}

// https://finnhub.io/docs/api/company-peers
export async function companyPeersQuery(symbol: string) {
  return fetchFinnhub<CompanyPeersQuery>(`stock/peers?symbol=${symbol}`);
}
export type CompanyPeersQuery = Array<string>;
