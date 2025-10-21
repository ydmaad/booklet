import ReviewList from '../components/ReviewList';
import BestsellerList from '../components/BestsellerList';
import { Link } from 'react-router-dom';

const MainPage = () => {
  const randomBG = ['/main_hero_2.jpg', '/main_hero_3.jpg', '/main_hero_4.jpg'];
  const randomIndex = Math.floor(Math.random() * 3);
  const selectedBG = randomBG[randomIndex];
  return (
    <div>
      <div
        className="h-[33vh] bg-cover flex flex-col items-center justify-center"
        style={{ backgroundImage: `url('${selectedBG}')` }}
      >
        <p className="[text-shadow:_2px_2px_8px_rgba(0,0,0,0.6)] text-white  text-5xl font-semibold mb-7">
          내가 읽은 책들을 기록해봐요!
        </p>
        <Link
          to="/barcode"
          className="bg-brand-button text-white px-4 py-2 rounded-lg shadow-lg shadow-brand-button hover:bg-brand-button/75 transition-colors duration-200"
        >
          기록하러 가기
        </Link>
      </div>
      <ReviewList />
      <BestsellerList />
    </div>
  );
};

export default MainPage;
