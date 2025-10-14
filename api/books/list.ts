import type { VercelRequest, VercelResponse } from "@vercel/node";
import axios from "axios";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const { queryType = "Bestseller", maxResults = 10, start = 1 } = req.query;

    const response = await axios.get(
      "http://www.aladin.co.kr/ttb/api/ItemList.aspx",
      {
        params: {
          ttbkey: process.env.TTB_KEY,
          QueryType: queryType,
          MaxResults: maxResults,
          start,
          output: "js",
          Version: "20131101",
        },
      }
    );

    res.status(200).json(response.data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "베스트셀러 API 실패" });
  }
}
