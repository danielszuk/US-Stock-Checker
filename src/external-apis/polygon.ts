import { POLYGON_API_KEY } from "../env";

function fetchPolygon<Response>(path: string) {
  return fetch(`https://api.polygon.io/${path}&apiKey=${POLYGON_API_KEY}`).then(
    async (rawResponse) => {
      const response = await rawResponse.json();
      if (response.error) throw new Error(response.error);
      else return response.results as Response;
    }
  );
}

export enum PolygonQueryKeys {
  DailyPrices = "PolygonQueryDailyPrices",
}

// ref: https://polygon.io/docs/stocks/get_v2_aggs_ticker__stocksticker__range__multiplier___timespan___from___to
export async function dailyPricesQuery(
  symbol: string,
  from: number, // Unix timestamp
  to: number // Unix timestamp
) {
  return fetchPolygon<Array<DailyPricesQueryItem>>(
    `v2/aggs/ticker/${symbol}/range/1/day/${from}/${to}?adjusted=true&sort=asc`
  );
}
export interface DailyPricesQueryItem {
  c: number;
  h: number;
  l: number;
  n: number;
  o: number;
  t: number;
  v: number;
  vw: number;
}
