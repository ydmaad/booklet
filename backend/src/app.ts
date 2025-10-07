import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";
import type { Request, Response } from "express";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "서버 작동중!" });
});

// 베스트 셀러 리스트 API
app.get("/api/books/list", async (req: Request, res: Response) => {
  try {
    const {
      queryType = "Bestseller",
      maxResults = 10,
      start = 1,
      searchTarget = "Book",
    } = req.query;

    const response = await axios.get(
      "http://www.aladin.co.kr/ttb/api/ItemList.aspx",
      {
        params: {
          ttbkey: process.env.TTB_KEY,
          QueryType: queryType,
          MaxResults: maxResults,
          start,
          SearchTarget: searchTarget,
          output: "js",
          Version: "20131101",
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.log("알라딘 베스트셀러 api 에러", error);
    res
      .status(500)
      .json({ error: "베스트셀러 책 리스트를 가져오는데 실패했습니다." });
  }
});

// ISBN으로 책 정보 검색 API
app.get("/api/books/isbn/:isbn", async (req: Request, res: Response) => {
  try {
    const { isbn } = req.params;

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

    res.json(response.data);
  } catch (error) {
    console.log("알라딘 책 검색 API 에러", error);
    res.status(500).json({ error: "책 정보를 가져오는데 실패했습니다." });
  }
});

app.listen(PORT, () => {
  console.log(`서버 실행: http://localhost:${PORT}`);
});
