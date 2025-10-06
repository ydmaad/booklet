import { Route, Routes } from "react-router-dom";
import BarcodeScanPage from "./pages/BarcodeScanPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import MainPage from "./pages/MainPage";
import MyPage from "./pages/MyPage";

function App() {
  return (
    <div className="px-32">
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/barcode" element={<BarcodeScanPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </div>
  );
}

export default App;
