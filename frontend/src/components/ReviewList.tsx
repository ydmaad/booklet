import ReviewItem from './ReviewItem';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../store/store';
import { fetchAllReviews } from '../store/slices/reviewsSlice';

const ReviewList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { allReviews, allReviewsLoading } = useSelector(
    (state: RootState) => state.reviews
  );

  useEffect(() => {
    dispatch(fetchAllReviews());
  }, [dispatch]);

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
          {allReviews.map((review) => (
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
    </div>
  );
};

export default ReviewList;
