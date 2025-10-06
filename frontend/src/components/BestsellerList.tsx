import { useAppDispatch, useAppSelector } from "../store/hooks";
import { useEffect } from "react";
import {
  fetchBooksFailure,
  fetchBooksStart,
  fetchBooksSuccess,
} from "../store/slices/booksSlice";
import axios from "axios";
import BookItem from "./BookItem";

const BestsellerList = () => {
  const books = useAppSelector((state) => state.books);
  const dispatch = useAppDispatch();
  const bestseller = books.items.item;

  useEffect(() => {
    dispatch(fetchBooksStart());
    const fetchBooks = async () => {
      try {
        const url = "http://localhost:3000/api/books/list?queryType=Bestseller";
        const response = await axios.get(url);
        dispatch(fetchBooksSuccess(response.data));
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "알 수 없는 오류가 발생했습니다.";
        dispatch(fetchBooksFailure(errorMessage));
      }
    };
    fetchBooks();
  }, []);
  return (
    <div>
      {bestseller.map((book) => (
        <div key={book.isbn13}>
          <BookItem book={book} />
        </div>
      ))}
    </div>
  );
};

export default BestsellerList;
