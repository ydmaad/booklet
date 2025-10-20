import { FiEdit } from 'react-icons/fi';
import { LuShare } from 'react-icons/lu';
import { FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../store/store';
import { useEffect } from 'react';
import { fetchMyReviews } from '../store/slices/reviewsSlice';
import MyReviewCard from '../components/MyReviewCard';

const MyPage = () => {
  const { user, profile } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { myReviews, _loading } = useSelector(
    (state: RootState) => state.reviews
  );

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchMyReviews(user.id));
    }
  }, [user?.id, dispatch]);

  return (
    <div className="flex flex-row justify-start mt-20">
      <div className="flex flex-col items-center mx-10">
        <p className="text-3xl font-bold">내 서재</p>
        <img
          src={profile?.avatar_url || '/devualt_image.jpg'}
          alt=""
          className="w-52 h-52 object-cover rounded-full my-10"
        />
        <div className="flex flex-row">
          <p className="text-xl font-bold mr-1">{profile?.nickname}</p>
          <FiEdit
            onClick={() => navigate('/mypage/edit')}
            className="w-4 h-4 cursor-pointer mt-1 text-gray-500"
          />
        </div>
        <p className="text-base font-bold underline text-gray-500">
          {profile?.email}
        </p>
        <div className="border flex flex-1 flex-col w-full p-5 rounded-lg mt-5">
          <p className="text-base font-bold">나의 키워드</p>
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
          <p className="text-base font-bold">한 줄 소개</p>
          <p>{profile?.bio || '한 줄 소개를 작성해주세요!'}</p>
        </div>
      </div>
      <div className="flex-1 ">
        <div className="flex items-center bg-white border border-gray-200 rounded-full px-4 py-2 mb-4 shadow-sm hover:shadow-md transition-shadow max-w-sm mx-auto">
          <FaSearch className="text-gray-400 mr-3" />
          <input
            type="text"
            placeholder="책 제목, 저자로 검색..."
            className="flex-1 outline-none text-sm"
          />
        </div>
        <div className="flex justify-end mb-3">
          <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
            <LuShare className="w-6 h-6 text-gray-600 hover:text-blue-500" />
          </button>
        </div>
        <div className="grid grid-cols-3 gap-8 justify-items-end">
          {myReviews?.map((review) => (
            <MyReviewCard key={review.id} review={review} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyPage;
