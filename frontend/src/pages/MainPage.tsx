import Header from "../components/Header";
import Footer from "../components/Footer";
import MyReviewList from "../components/MyReviewList";
import BestsellerList from "../components/BestsellerList";
import { Link } from "react-router-dom";

const MainPage = () => {
  return (
    <div>
      <Header />
      <Link
        to="/barcode"
        className="bg-indigo-500 text-white px-4 py-2 rounded-lg shadow-lg shadow-indigo-500/50 hover:bg-indigo-600 transition-colors duration-200"
      >
        바코드 스캔 페이지로 가는 임시 버튼입니다!!
      </Link>
      <MyReviewList />
      <BestsellerList />
      <Footer />
    </div>
  );
};

export default MainPage;
