import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";
import { FINNHUB_API_KEY } from "../../../env";

export const config = {
  api: {
    responseLimit: false,
  },
};

// const cache = new NodeCache({
//   stdTTL: 60 * 60 * 24, // 24 hours
// });

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const finnhubUrl = req.url?.replace("/api/finnhub/", "");
  if (!finnhubUrl) {
    res.status(400);
    res.send({ error: "Invalid query" });
    return;
  }

  // // Try to resolve from cache
  // if (cache.has(finnhubUrl)) {
  //   res.status(200).json(cache.get(finnhubUrl));
  //   return;
  // }

  // Fetch from Finnhub and cache
  try {
    const finnhubResponse = await axios.get(
      `https://finnhub.io/api/v1/${finnhubUrl}&token=${FINNHUB_API_KEY}`
    );
    // if (finnhubResponse.status === 200)
    // cache.set(finnhubUrl, finnhubResponse.data); // save to cache
    res.status(finnhubResponse.status).json(finnhubResponse.data);
  } catch (error: any) {
    console.error(error?.response?.data, error?.code, error?.config);
    res.status(500).json({ error: "Couldn't fetch data from Finnhub" });
  }
}
