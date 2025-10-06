import { useAppDispatch, useAppSelector } from "../store/hooks";
import { useEffect } from "react";
import {
  fetchBooksFailure,
  fetchBooksStart,
  fetchBooksSuccess,
} from "../store/slices/booksSlice";
import axios from "axios";
import BookItem from "./BookItem";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
// @ts-expect-error - Swiper CSS import type issue
import "swiper/css";
// @ts-expect-error - Swiper Navigation CSS
import "swiper/css/navigation";
// @ts-expect-error - Swiper Pagination CSS
import "swiper/css/pagination";

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
    <div className="w-full mx-auto">
      <div className="text-center mx-auto">
        <h1 className="text-3xl font-bold text-gray-700 py-6">베스트셀러</h1>
      </div>
      <Swiper
        slidesPerView={5}
        spaceBetween={100}
        loop={true}
        navigation={true}
        modules={[Navigation]}
        className="w-[1200px]"
      >
        {bestseller.map((book) => (
          <SwiperSlide key={book.isbn13}>
            <BookItem book={book} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default BestsellerList;
