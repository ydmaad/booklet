import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const MyReviewPage = () => {
  const { isbn } = useParams();
  const [bookInfo, setBookInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!isbn) {
      navigate("/isbn");
      return;
    }

    const fetchBookInfo = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `http://localhost:3000/api/books/isbn/${isbn}`
        );

        const data = await response.json();
        console.log("받아온 책 정보:::", data.item[0]);
      } catch (err: any) {
        console.error("api 에러:::", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBookInfo();
  }, [isbn, navigate]);
  return (
    <div>
      <h1>Book Review</h1>
      <p>받아온 ISBN: {isbn}</p>
    </div>
  );
};

export default MyReviewPage;
