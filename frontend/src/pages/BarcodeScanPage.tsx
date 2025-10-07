import { FaBarcode } from "react-icons/fa";
import { Link } from "react-router-dom";

const BarcodeScanPage = () => {
  return (
    <div className="flex flex-col items-center justify-start min-h-screen pt-28 space-y-12">
      <div className="flex flex-col items-center justify-center space-y-4">
        <FaBarcode className="w-32 h-32" />
        <p className="text-5xl font-bold">바코드 스캔</p>
        <p className="text-2xl font-bold text-gray-500">
          책 바코드를 프레임 안에 맞춰주세요.
        </p>
      </div>
      <div className="w-[500px] h-[300px] border"></div>
      <div className="flex flex-col items-center space-y-4 text-center">
        <p className="text-2xl font-bold text-gray-500">
          스캔에 어려움이 있나요?
        </p>
        <Link
          to="/isbn"
          className="bg-indigo-500 text-white text-xl px-16 py-2 rounded-lg shadow-lg shadow-indigo-500/50 hover:bg-indigo-600 transition-colors duration-200"
        >
          직접 ISBN 입력하기
        </Link>
      </div>
    </div>
  );
};

export default BarcodeScanPage;
