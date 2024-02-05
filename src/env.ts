if (!process.env.FINNHUB_API_KEY)
  throw new Error("FINNHUB_API_KEY is a required variable, but it was not set");
export const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY;

if (!process.env.POLYGON_API_KEY)
  throw new Error("POLYGON_API_KEY is a required variable, but it was not set");
export const POLYGON_API_KEY = process.env.POLYGON_API_KEY;
