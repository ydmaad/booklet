import { Route, Routes } from "react-router-dom";
import MainPage from "./pages/mainPage";
import BarcodeScanPage from "./pages/BarcodeScanPage";
import MyPage from "./pages/myPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/mypage" element={<MyPage />} />
      <Route path="/barcode" element={<BarcodeScanPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
    </Routes>
  );
}

export default App;
