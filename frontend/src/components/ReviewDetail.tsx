import { HiOutlineBookmark } from 'react-icons/hi';
import { useNavigate, useParams } from 'react-router-dom';
import { FiEdit } from 'react-icons/fi';
import { FiTrash2 } from 'react-icons/fi';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import type { Review } from '../types/book.types';
import { useSelector } from 'react-redux';
import type { RootState } from '../store/store';

interface ReviewWithProfile extends Review {
  profiles: {
    nickname: string;
    avatar_url: string;
  };
}

const ReviewDetail = () => {
  const { id } = useParams();
  const [review, setReview] = useState<ReviewWithProfile | null>(null);
  const navigate = useNavigate();
  const currentUser = useSelector((state: RootState) => state.auth.user);
  console.log(currentUser?.id);

  useEffect(() => {
    const fetchReview = async () => {
      const { data, error } = await supabase
        .from('book_reviews')
        .select('*, profiles(nickname,avatar_url)')
        .eq('id', id)
        .single();

      if (error) console.error(error);
      else setReview(data);

      console.log(data);
    };
    fetchReview();
  }, [id]);

  const isAuthor = review?.user_id === currentUser?.id;

  const handleDelete = async () => {
    if (!isAuthor) {
      alert('작성자가 아닙니다!');
      return;
    }

    if (window.confirm('정말 삭제하시겠습니까?')) {
      const { error } = await supabase
        .from('book_reviews')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('리뷰 삭제 실패:::', error);
      } else {
        navigate('/');
      }
    }
  };

  if (!review) {
    return (
      <div className="my-20 mx-40 text-center">
        <p>로딩 중...</p>
      </div>
    );
  }

  const handleEdit = () => {
    if (!isAuthor) {
      alert('작성자만 수정할 수 있습니다!');
      return;
    }
    navigate(`/review/edit/${id}`);
  };

  return (
    <div className="my-20 mx-40">
      <div className="flex justify-between">
        <div className="flex flex-row">
          {/* 이미지 */}
          <div className="w-44 h-60 border mr-20 flex-shrink-0">
            <img
              src={review.cover}
              alt={review.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* 책 정보 */}
          <div className="my-auto space-y-7">
            <p className="text-base">{review.status}</p>
            <div className="flex flex-row">
              <p
                className={` font-bold mr-3 ${
                  review.title.length <= 15 ? 'text-5xl' : 'text-4xl'
                }`}
              >
                {review.title}
              </p>
              <HiOutlineBookmark className="w-10 h-10 my-auto" />
            </div>
            <div className="flex flex-row text-gray-400">
              <p
                className={`mr-4 ${
                  review.author.length <= 30 ? 'text-base' : 'text-sm'
                }`}
              >
                {review.publisher}
              </p>
              <span
                className={`mr-4 ${
                  review.author.length <= 30 ? 'text-base' : 'text-sm'
                }`}
              >
                |
              </span>
              <p
                className={`mr-4 ${
                  review.author.length <= 30 ? 'text-base' : 'text-sm'
                }`}
              >
                {review.author}
              </p>
              <span
                className={`mr-4 ${
                  review.author.length <= 30 ? 'text-base' : 'text-sm'
                }`}
              >
                |
              </span>
              <p
                className={`${
                  review.author.length <= 30 ? 'text-base' : 'text-sm'
                }`}
              >
                {review.pubDate}
              </p>
            </div>
          </div>
        </div>
        {isAuthor && (
          <div className="flex flex-row gap-3 text-brand-button">
            <FiEdit onClick={handleEdit} className="w-6 h-6 cursor-pointer" />
            <FiTrash2
              onClick={handleDelete}
              className="w-6 h-6 cursor-pointer"
            />
          </div>
        )}
      </div>
      <div className="border-t my-10 border-gray-300"></div>
      <div className="flex flex-row bg-gray-200 p-5 rounded-md">
        <div className="flex-shrink-0">
          <img
            src={review.profiles.avatar_url || '/default_image.jpg'}
            alt=""
            className="w-20 h-20 rounded-full object-cover mr-5"
          />
        </div>
        <div className="flex-shrink-0 mr-5">
          <p className="text-base mb-2">{'⭐️'.repeat(review.stars)}</p>
          <p className="text-base mb-1">{review.profiles.nickname}</p>
          <p className="text-sm">
            {new Date(review.created_at).toLocaleDateString('ko-KR')}
          </p>
        </div>
        <div className="bg-white rounded-md p-2 flex-1 whitespace-pre-wrap">
          <p>{review.memo}</p>
        </div>
      </div>
    </div>
  );
};

export default ReviewDetail;
