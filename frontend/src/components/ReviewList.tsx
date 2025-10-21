import ReviewItem from './ReviewItem';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../store/store';
import { fetchAllReviews } from '../store/slices/reviewsSlice';

const ReviewList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { allReviews, allReviewsLoading } = useSelector(
    (state: RootState) => state.reviews
  );
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const pagesPerBlock = 5;

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentBlock = Math.ceil(currentPage / pagesPerBlock);
  const totalPages = Math.ceil(allReviews.length / itemsPerPage);
  const startPage = (currentBlock - 1) * pagesPerBlock + 1;
  const endPage = Math.min(startPage + pagesPerBlock - 1, totalPages);
  const currentReviews = allReviews.slice(startIndex, endIndex);

  const handlePrevBlock = () => {
    const prevBlockPage = Math.max(startPage - pagesPerBlock, 1);
    setCurrentPage(prevBlockPage);
  };

  const handleNextBlock = () => {
    const nextBlockPage = Math.min(startPage + pagesPerBlock, totalPages);
    setCurrentPage(nextBlockPage);
  };

  useEffect(() => {
    dispatch(fetchAllReviews());
  }, [dispatch]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  return (
    <div className="mx-40">
      <div className="text-center mx-auto mt-10">
        <h1 className="text-3xl font-bold text-gray-700 py-6">
          최신 리뷰 리스트
        </h1>
      </div>
      {allReviewsLoading ? (
        <div className="h-60 flex justify-center items-center">
          <p className="text-3xl text-gray-600">로딩 중...</p>
        </div>
      ) : allReviews.length === 0 ? (
        <div className="h-60 flex justify-center items-center">
          <p className="text-3xl text-gray-600">
            첫 책을 등록하면 이곳에 기록이 시작돼요!
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          {currentReviews.map((review) => (
            <ReviewItem
              key={review.id}
              id={review.id}
              cover={review.cover}
              title={review.title}
              author={review.author}
              memo={review.memo}
              stars={review.stars}
            />
          ))}
        </div>
      )}
      <div className="flex justify-center items-center gap-2 my-10">
        {/* 이전 블록 */}
        <button
          onClick={handlePrevBlock}
          disabled={startPage === 1}
          className={`px-3 py-1.5 rounded-full text-sm transition-all duration-200 
            ${
              startPage === 1
                ? 'text-gray-400 cursor-not-allowed bg-gray-100'
                : 'text-gray-700 hover:bg-gray-200'
            }`}
        >
          ← 이전
        </button>

        {/* 페이지 번호 */}
        <div className="flex gap-1">
          {Array.from(
            { length: endPage - startPage + 1 },
            (_, index) => startPage + index
          ).map((pageNum) => (
            <button
              key={pageNum}
              onClick={() => setCurrentPage(pageNum)}
              className={`w-8 h-8 rounded-full text-sm font-medium transition-all duration-200
                  ${
                    currentPage === pageNum
                      ? 'bg-[#245A48] text-white shadow-md scale-105'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
            >
              {pageNum}
            </button>
          ))}
        </div>

        {/* 다음 블록 */}
        <button
          onClick={handleNextBlock}
          disabled={endPage === totalPages}
          className={`px-3 py-1.5 rounded-full text-sm transition-all duration-200 
            ${
              endPage === totalPages
                ? 'text-gray-400 cursor-not-allowed bg-gray-100'
                : 'text-gray-700 hover:bg-gray-200'
            }`}
        >
          다음 →
        </button>
      </div>
    </div>
  );
};

export default ReviewList;
