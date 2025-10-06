import Header from "../components/Header";
import Footer from "../components/Footer";
import MyReviewList from "../components/MyReviewList";
import BestsellerList from "../components/BestsellerList";

const MainPage = () => {
  return (
    <div>
      <Header />
      <MyReviewList />
      <BestsellerList />
      <Footer />
    </div>
  );
};

export default MainPage;
