import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";
import { POLYGON_API_KEY } from "../../../env";

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
  const polygonUrl = req.url?.replace("/api/polygon/", "");
  if (!polygonUrl) {
    res.status(400);
    res.send({ error: "Invalid query" });
    return;
  }

  // // Try to resolve from cache
  // if (cache.has(polygonUrl)) {
  //   res.status(200).json(cache.get(polygonUrl));
  //   return;
  // }

  // Fetch from Polygon and cache
  try {
    const polygonResponse = await axios.get(
      `https://api.polygon.io/${polygonUrl}&apiKey=${POLYGON_API_KEY}`
    );
    // if (polygonResponse.status === 200)
    //   cache.set(polygonUrl, polygonResponse.data); // save to cache
    res.status(polygonResponse.status).json(polygonResponse.data);
  } catch (error: any) {
    console.error(error?.response?.data, error?.code, error?.config);
    res.status(500).json({ error: "Couldn't fetch data from Polygon" });
  }
}
