import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "서버 작동중!" });
});

app.listen(PORT, () => {
  console.log(`서버 실행: http://localhost:${PORT}`);
});
