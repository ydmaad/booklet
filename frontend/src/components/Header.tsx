import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import type { RootState, AppDispatch } from '../store/store';

const Header = () => {
  // const [isLoggedIn, setIsLoggedIn] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  // Redux에서 프로필 정보 가져오기
  const { profile, user } = useSelector((state: RootState) => state.auth);

  const handleLogout = async () => {
    await dispatch(logout());
    navigate('/');
  };

  return (
    <header className="flex justify-between py-5 bg-gray-100">
      <div
        onClick={() => navigate("/")}
        className="text-xl font-bold cursor-pointer"
      >
        별책부록
      </div>

      <nav className="flex flex-row gap-3">
        {user ? (
          <>
            <span className="text-lg">{profile?.nickname} 님</span>
            <Link to="/mypage" className="text-lg">
              마이페이지
            </Link>
            <button onClick={handleLogout} className="text-lg">로그아웃</button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-lg">
              로그인
            </Link>
            <Link to="/register" className="text-lg">
              회원가입
            </Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
