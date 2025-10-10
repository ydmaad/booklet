import MyReviewList from "../components/MyReviewList";
import BestsellerList from "../components/BestsellerList";
import { Link } from "react-router-dom";

const MainPage = () => {
  return (
    <div>
      <div className="h-[33vh] bg-[url('/main_hero_4.jpg')] bg-cover flex flex-col items-center justify-center">
        <p className="text-white text-5xl font-semibold mb-7">
          내가 읽은 책들을 기록해봐요!
        </p>
        <Link
          to="/barcode"
          className="bg-indigo-500 text-white px-4 py-2 rounded-lg shadow-lg shadow-indigo-500/50 hover:bg-indigo-600 transition-colors duration-200"
        >
          기록하러 가기
        </Link>
      </div>
      <MyReviewList />
      <BestsellerList />
    </div>
  );
};

export default MainPage;
