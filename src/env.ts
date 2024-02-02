if (!process.env.NEXT_PUBLIC_FINNHUB_TOKEN)
  throw new Error(
    "NEXT_PUBLIC_FINNHUB_TOKEN is a required variable, but it was not set"
  );
export const FINNHUB_TOKEN = process.env.NEXT_PUBLIC_FINNHUB_TOKEN;
