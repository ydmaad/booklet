import { HiOutlineBookmark } from 'react-icons/hi';
import { useNavigate, useParams } from 'react-router-dom';
import { FiEdit } from 'react-icons/fi';
import { FiTrash2 } from 'react-icons/fi';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import type { Review } from '../types/book.types';

interface ReviewWithProfile extends Review {
  profiles: {
    nickname: string;
  };
}

const ReviewDetail = () => {
  const { id } = useParams();
  const [review, setReview] = useState<ReviewWithProfile | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReview = async () => {
      const { data, error } = await supabase
        .from('book_reviews')
        .select('*, profiles(nickname)')
        .eq('id', id)
        .single();

      if (error) console.error(error);
      else setReview(data);

      console.log(data);
    };
    fetchReview();
  }, [id]);

  const handleDelete = async () => {
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

  return (
    <div className="my-20 mx-40">
      <div className="flex justify-between">
        <div className="flex flex-row">
          {/* 이미지 */}
          <div className="w-44 h-60 border mr-20">
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
              <p className="text-5xl font-bold mr-3">{review.title}</p>
              <HiOutlineBookmark className="w-10 h-10 my-auto" />
            </div>
            <div className="flex flex-row text-gray-400">
              <p className="mr-4">{review.publisher}</p>
              <span className="mr-4">|</span>
              <p className="mr-4">{review.author}</p>
              <span className="mr-4">|</span>
              <p>{review.pubDate}</p>
            </div>
          </div>
        </div>
        <div className="flex flex-row gap-3 text-gray-500">
          <FiEdit className="w-6 h-6 cursor-pointer" />
          <FiTrash2 onClick={handleDelete} className="w-6 h-6 cursor-pointer" />
        </div>
      </div>
      <div className="border-t my-10 border-gray-300"></div>
      <div className="flex flex-row bg-gray-200 p-5 rounded-md">
        <div className="flex-shrink-0">
          <img
            src="/default_image.jpg"
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
        <div className="bg-white rounded-md p-2 flex-1">
          <p>{review.memo}</p>
        </div>
      </div>
    </div>
  );
};

export default ReviewDetail;
