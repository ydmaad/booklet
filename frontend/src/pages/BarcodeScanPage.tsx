import { useState } from "react";
import { FaBarcode } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useZxing } from "react-zxing";

const BarcodeScanPage = () => {
  const [scanStatus, setScanStatus] = useState<"success" | "error" | null>(
    null
  );
  const [isScanning, setIsScanning] = useState(true);
  const navigate = useNavigate();

  const playBeep = () => {
    const audio = new Audio(
      "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYHGGS66+adUhENT6Xt8bllHAU2jdXy0HovBSh+zPDhkUEKFV616+qnVRILRp/g8r1sIQUrgs7y2Ik2BxhkuuvmoVETDU6k7fG4aB0FNo3V8tB6LwQof8rx4ZJBChVctuvqqFUSC0af4PK+bSAEK4HO8tqJNgcYZLrr5qFRFA1OpO3xuGcfBTWM1fLRei8EKH7K8eCSQgoVXLbr6qhVEwtGn+DyvmwgBCuBzvLaiTYHGGS76+ihUBMNTqTt8bhnHwU1jNXy0HowBCh+yvHgkkIKFVy26+qoVRMLRp/h8r5sIAQrgc7y2ok2BxhkuuvooVATDU6k7fG4Zx8FNYzV8tJ6LwQofsvx4JJBCRW27Orpq1YSC0af4PK+bCAEK4HO8tqJNgcYZbrr6KFREw1OpO3xuGcfBTWN1fLSei8EJ37K8eCQQAoUXLbr66lVEQtGn+DyvmwgBCuBzvLaiTYHGGS66+ihUBMNTqTt8bhnHwU1jdXy0novBCh+yvHgkkIKFVy26+qoVRMLRp/h8r5sIAQrgs7y2Yk2Bxhkuuvnm1ATDhOl7fG4Zx8FM43V8tJ7LwUnfsrx4JBAA0m3"
    );
    audio.play();
  };

  const { ref } = useZxing({
    constraints: {
      video: {
        facingMode: "environment", // 후면 카메라
        width: { ideal: 1920 },
        height: { ideal: 1080 },
      },
    },
    onDecodeResult(result) {
      if (!isScanning) return;

      const code = result.getText();

      if (code.length === 13 && /^\d{13}$/.test(code)) {
        setIsScanning(false);
        setScanStatus("success");
        playBeep();
        setTimeout(() => {
          navigate(`/my-review/${code}`);
        }, 1500);
      }
    },
  });

  return (
    <div className="flex flex-col items-center justify-start min-h-screen pt-28 space-y-12">
      <div className="flex flex-col items-center justify-center space-y-4">
        <FaBarcode className="w-32 h-32" />
        <p className="text-5xl font-bold text-brand-title">바코드 스캔</p>
        <p className="text-2xl font-bold text-gray-500">
          책 바코드를 프레임 안에 맞춰주세요.
        </p>
      </div>

      <div className="relative w-[500px] h-[300px] border">
        <video ref={ref} className="w-full h-full object-cover"></video>
        <div
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                w-4/5 h-3/5 border-4 border-dashed pointer-events-none
                ${
                  scanStatus === "success"
                    ? "border-green-500"
                    : scanStatus === "error"
                    ? "border-red-500"
                    : "border-gray-600"
                }`}
        ></div>
        <div className="absolute top-1/2 left-0 w-full h-1 bg-red-500 -translate-y-1/2"></div>
      </div>

      {scanStatus === "success" && (
        <div className="bg-gradient-to-r from-emerald-400 to-teal-500 text-white px-5 py-2.5 rounded-xl font-semibold shadow-md">
          ✅ 인식 완료!
        </div>
      )}

      <div className="flex flex-col items-center space-y-4 text-center">
        <p className="text-2xl font-bold text-gray-500">
          스캔에 어려움이 있나요?
        </p>
        <Link
          to="/isbn"
          className="bg-brand-button text-white text-xl px-16 py-2 rounded-lg shadow-lg shadow-brand-button/50 hover:bg-brand-button/75 transition-colors duration-200"
        >
          직접 ISBN 입력하기
        </Link>
      </div>
    </div>
  );
};

export default BarcodeScanPage;
