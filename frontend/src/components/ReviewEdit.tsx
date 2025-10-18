import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { IoBookOutline } from 'react-icons/io5';
import InputField from './InputField';
import type { ReadStatus, Review } from '../types/book.types';

const ReviewEdit = () => {
  const { id } = useParams();
  const [review, setReview] = useState<Review | null>(null);
  const navigate = useNavigate();
  const [status, setStatus] = useState<ReadStatus>('');
  const [stars, setStars] = useState('');
  const [memo, setMemo] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const statusColors: Record<Exclude<ReadStatus, ''>, string> = {
    '📘 읽고 싶은': 'text-pink-800',
    '📖 읽는 중': 'text-blue-800',
    '✅ 읽음': 'text-green-800',
    '⏸ 잠시 멈춤': 'text-yellow-800',
    '⛔ 중단': 'text-red-800',
  };

  useEffect(() => {
    const fetchReview = async () => {
      const { data, error } = await supabase
        .from('book_reviews')
        .select('*')
        .eq('id', id)
        .single();

      console.log(data);
      if (data) {
        setReview(data);
        setStatus(data.status);
        setStars(data.stars.toString());
        setMemo(data.memo);
      }

      if (error) {
        console.error('데이터를 가져오는 중 오류가 있습니다.', error);
      }
    };
    fetchReview();
  }, [id]);

  const handleSubmit = async () => {
    if (isSubmitting) return;

    if (!status || !stars || !memo) {
      alert('모든 항목을 입력해주세요!');
      return;
    }

    setIsSubmitting(true);

    const { error } = await supabase
      .from('book_reviews')
      .update({
        status: status,
        stars: Number(stars),
        memo: memo,
      })
      .eq('id', id);

    if (error) {
      console.error('수정 실패:::', error);
      alert('리뷰 수정에 실패했습니다!');
      setIsSubmitting(false);
    } else {
      navigate(`/review/${id}`);
    }
  };

  return (
    <div>
      <div className="flex flex-col items-center text-center  py-10">
        <IoBookOutline className="w-28 h-28" />
        <p className="text-5xl font-bold">Book Review</p>
        <p className="text-2xl font-semibold text-gray-500">
          내가 읽은 책의 느낀점, 인상깊은 문장, 새로 알게된 정보 등을 작성하세요
        </p>
      </div>

      <div className="flex gap-20 justify-center py-10">
        <div className="w-[350px] h-[500px] border">
          <img
            src={review?.cover}
            alt={review?.title}
            className="w-full h-full object-contain"
          />
        </div>
        <div>
          <InputField
            label="책 제목"
            value={review?.title}
            placeholder=""
            onChange={(e) => console.log(e)}
          />
          <InputField label="저자" value={review?.author} placeholder="" />
          <InputField label="출판사" value={review?.publisher} placeholder="" />
          <InputField label="발행일" value={review?.pubDate} placeholder="" />
          <div className="flex flex-row items-center gap-10 mb-5">
            <p className="text-lg w-[120px]">읽기 상태</p>
            <select
              name="readStatus"
              id="readStatus"
              onChange={(e) => setStatus(e.target.value as ReadStatus)}
              value={status}
              className={`border rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer transition-all ${
                status ? statusColors[status] : ''
              }`}
            >
              <option value="">상태 선택</option>
              <option value="읽고 싶은">📘 읽고 싶은</option>
              <option value="읽는 중">📖 읽는 중</option>
              <option value="읽음">✅ 읽음</option>
              <option value="잠시 멈춤">⏸ 잠시 멈춤</option>
              <option value="중단">⛔ 중단</option>
            </select>
          </div>
          <div className="flex flex-row items-center gap-10 mb-5">
            <p className="text-lg w-[120px]">별점</p>
            <select
              name="stars"
              id="stars"
              value={stars}
              onChange={(e) => setStars(e.target.value)}
              className="text-lg border py-1 px-2 rounded-lg "
            >
              <option value="1">⭐️</option>
              <option value="2">⭐️⭐️</option>
              <option value="3">⭐️⭐️⭐️</option>
              <option value="4">⭐️⭐️⭐️⭐️</option>
              <option value="5">⭐️⭐️⭐️⭐️⭐️</option>
            </select>
          </div>
          <div className="flex justify-between items-start gap-20 mb-5">
            <p className="text-lg">한줄평/메모</p>
            <textarea
              name="memo"
              id="memo"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              placeholder="책을 읽고 느낀 점이나 기억하고 싶은 문장을 적어보세요."
              className="w-[500px] h-[400px] border rounded-lg p-3 text-base resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
            ></textarea>
          </div>
        </div>
      </div>
      <div className="flex flex-row gap-10 items-center justify-center mb-40">
        <button
          onClick={() => navigate('/')}
          className="bg-indigo-200 text-gray-600 text-xl text-center w-[130px] py-3 rounded-lg shadow-lg shadow-indigo-500/50 hover:bg-indigo-300 transition-colors duration-200"
        >
          취소
        </button>
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="bg-indigo-500 text-white text-xl text-center w-[130px] py-3 rounded-lg shadow-lg shadow-indigo-500/50 hover:bg-indigo-600 transition-colors duration-200"
        >
          {isSubmitting ? '저장 중...' : '수정'}
        </button>
      </div>
    </div>
  );
};

export default ReviewEdit;
