import { useState } from "react";
import { FaBarcode } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useZxing } from "react-zxing";

const BarcodeScanPage = () => {
  const [scannedCode, setScannedCode] = useState("");

  const { ref } = useZxing({
    constraints: {
      video: {
        facingMode: "environment", // 후면 카메라
        width: { ideal: 1920 },
        height: { ideal: 1080 },
      },
    },
    onDecodeResult(result) {
      const code = result.getText();
      setScannedCode(code);
      console.log("✅ 스캔 성공!!!", code);
    },
  });
  return (
    <div className="flex flex-col items-center justify-start min-h-screen pt-28 space-y-12">
      <div className="flex flex-col items-center justify-center space-y-4">
        <FaBarcode className="w-32 h-32" />
        <p className="text-5xl font-bold">바코드 스캔</p>
        <p className="text-2xl font-bold text-gray-500">
          책 바코드를 프레임 안에 맞춰주세요.
        </p>
      </div>

      <div className="w-[500px] h-[300px] border">
        <video ref={ref} className="w-full h-full object-cover"></video>
      </div>

      {scannedCode && (
        <div className="w-[500px] bg-green-50 p-4 rounded-lg border-2 border-green-200">
          <p className="text-sm text-gray-600">스캔된 ISBN:</p>
          <p className="text-2xl font-bold text-green-600 break-all">
            {scannedCode}
          </p>
        </div>
      )}

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
