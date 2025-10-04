import { Route, Routes } from "react-router-dom";
import MainPage from "./pages/mainPage";
import BarcodeScanPage from "./pages/BarcodeScanPage";
import MyPage from "./pages/myPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/mypage" element={<MyPage />} />
      <Route path="/barcode" element={<BarcodeScanPage />} />
    </Routes>
  );
}

export default App;
