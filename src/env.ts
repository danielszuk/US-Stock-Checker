if (!process.env.NEXT_PUBLIC_FINNHUB_API_KEY)
  throw new Error("FINNHUB_API_KEY is a required variable, but it was not set");
export const FINNHUB_API_KEY = process.env.NEXT_PUBLIC_FINNHUB_API_KEY;
