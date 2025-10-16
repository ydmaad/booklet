import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/slices/authSlice";
import type { RootState, AppDispatch } from "../store/store";

const Header = () => {
  // const [isLoggedIn, setIsLoggedIn] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  // Redux에서 프로필 정보 가져오기
  const { profile, user } = useSelector((state: RootState) => state.auth);

  const handleLogout = async () => {
    await dispatch(logout());
    navigate("/");
  };

  return (
    <header className="flex justify-between bg-white py-3">
      <div
        onClick={() => navigate("/")}
        className="text-xl font-bold cursor-pointer"
      >
        <img src="/title.png" alt="title" className="h-14" />
      </div>

      <nav className="flex flex-row gap-3">
        {user ? (
          <div className="flex justify-center items-center">
            <span className="text-lg">{profile?.nickname} 님</span>
            <Link to="/mypage" className="text-lg">
              마이페이지
            </Link>
            <button onClick={handleLogout} className="ml-5">
              <p className="text-lg">로그아웃</p>
            </button>
          </div>
        ) : (
          <div className="flex justify-center items-center">
            <Link to="/login" className="text-lg">
              로그인
            </Link>
            <Link to="/register" className="text-lg ml-5">
              회원가입
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
