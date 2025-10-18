import MyReviewItem from './MyReviewItem';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import type { Review } from '../types/book.types';

const MyReviewList = () => {
  const [myReviews, setMyReviews] = useState<Review[]>([]);

  useEffect(() => {
    const fetchMyReviews = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setMyReviews([]);
        return;
      }

      const { data, error } = await supabase
        .from('book_reviews')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false }); // 최신순 정렬

      if (error) console.error('리뷰 불러오기 실패:', error);
      else setMyReviews(data || []);
    };

    fetchMyReviews();
  }, []);

  return (
    <div className="mx-40">
      <div className="text-center mx-auto mt-10">
        <h1 className="text-3xl font-bold text-gray-700 py-6">
          나의 독서 리스트
        </h1>
      </div>
      {myReviews.length === 0 ? (
        <p className="">첫 책을 등록하면 이곳에 기록이 시작돼요!</p>
      ) : (
        <div className="flex flex-col gap-5">
          {myReviews.map((review) => (
            <MyReviewItem
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

export default MyReviewList;
