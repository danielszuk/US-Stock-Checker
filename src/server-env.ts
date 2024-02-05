if (!process.env.POLYGON_API_KEY)
  throw new Error("POLYGON_API_KEY is a required variable, but it was not set");
export const POLYGON_API_KEY = process.env.POLYGON_API_KEY;
