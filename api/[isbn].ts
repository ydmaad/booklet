import type { VercelRequest, VercelResponse } from "@vercel/node";
import axios from "axios";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const { isbn } = req.query;

    if (!isbn || Array.isArray(isbn)) {
      res.status(400).json({ error: "ISBN이 필요합니다." });
      return;
    }

    const response = await axios.get(
      "http://www.aladin.co.kr/ttb/api/ItemLookUp.aspx",
      {
        params: {
          ttbkey: process.env.TTB_KEY,
          itemIdType: "ISBN13",
          ItemId: isbn,
          output: "js",
          Version: "20131101",
          OptResult: "ebookList,usedList,reviewList",
        },
      }
    );

    res.status(200).json(response.data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "책 정보 API 실패" });
  }
}
