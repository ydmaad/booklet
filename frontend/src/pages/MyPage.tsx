import { FiEdit } from 'react-icons/fi';
import { LuShare } from 'react-icons/lu';
import { FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../store/store';
import { useEffect, useState } from 'react';
import { fetchMyReviews } from '../store/slices/reviewsSlice';
import MyReviewCard from '../components/MyReviewCard';

const MyPage = () => {
  const { user, profile } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { myReviews, _loading } = useSelector(
    (state: RootState) => state.reviews
  );
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchMyReviews(user.id));
    }
  }, [user?.id, dispatch]);

  const filteredReviews = myReviews?.filter(
    (review) =>
      review.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-row justify-start mt-20">
      <div className="flex flex-col items-center mx-10">
        <p className="text-3xl font-bold text-brand-title">내 서재</p>
        <img
          src={profile?.avatar_url || '/devualt_image.jpg'}
          alt=""
          className="w-52 h-52 object-cover rounded-full my-10"
        />
        <div className="flex flex-row">
          <p className="text-xl font-bold mr-1 text-brand-button">
            {profile?.nickname}
          </p>
          <FiEdit
            onClick={() => navigate('/mypage/edit')}
            className="w-4 h-4 cursor-pointer mt-1 text-gray-500"
          />
        </div>
        <p className="text-base font-bold underline text-gray-500">
          {profile?.email}
        </p>
        <div className="border flex flex-1 flex-col w-full p-5 rounded-lg mt-5 bg-white shadow-md">
          <p className="text-base font-bold">🏷️ 나의 키워드</p>
          <div className="mb-6">
            {profile?.keywords && profile.keywords.length > 0 ? (
              profile?.keywords?.map((word, index) => (
                <span key={index} className="mr-2">
                  #{word}
                </span>
              ))
            ) : (
              <span>나의 독서 키워드를 작성해주세요!</span>
            )}
          </div>
          <p className="text-base font-bold">✨ 한 줄 소개</p>
          <p>{profile?.bio || '한 줄 소개를 작성해주세요!'}</p>
        </div>
      </div>
      <div className="flex-1 ">
        <div className="flex items-center bg-white border border-gray-200 rounded-full px-4 py-2 mb-4 shadow-sm hover:shadow-md transition-shadow max-w-sm mx-auto">
          <FaSearch className="text-gray-400 mr-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="책 제목, 저자로 검색..."
            className="flex-1 outline-none text-sm"
          />
        </div>
        <div className="flex justify-end mb-3 mr-5 space-x-2">
          <button className="flex items-center px-3 py-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
            <LuShare className="w-5 h-5 text-[#317C61] mr-1" />
            <span className="text-sm text-[#317C61]">공유하기</span>
          </button>

          <button
            onClick={() => navigate('/recommend')}
            className="px-4 py-2 bg-[#245A48] text-white rounded-full hover:bg-[#317C61] transition-colors"
          >
            ✨ AI 추천받기
          </button>
        </div>
        <div className="grid grid-cols-3 gap-8 justify-items-center">
          {filteredReviews && filteredReviews.length > 0 ? (
            filteredReviews.map((review) => (
              <MyReviewCard key={review.id} review={review} />
            ))
          ) : (
            <div className="col-span-3 flex justify-center">
              <p className="text-center text-gray-500 mt-10">
                검색 결과가 없습니다 😢
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyPage;
