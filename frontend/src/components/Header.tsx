import { useState } from "react";
import { Link } from "react-router-dom";

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  return (
    <header className="flex justify-between py-5 bg-gray-100">
      <div className="text-xl font-bold">별책부록</div>

      {/* 테스트용 버튼 - 나중에 삭제할 거예요! */}
      <button
        onClick={() => setIsLoggedIn(!isLoggedIn)}
        className="bg-yellow-400 px-3 py-1 rounded text-sm"
      >
        {isLoggedIn ? "로그아웃 테스트" : "로그인 테스트"}
      </button>

      <nav className="flex flex-row gap-3">
        {isLoggedIn ? (
          <>
            <span className="text-lg">닉네임님</span>
            <Link to="/mypage" className="text-lg">
              마이페이지
            </Link>
            <button className="text-lg">로그아웃</button>
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
