import { useState } from "react";
import { BsKeyboard } from "react-icons/bs";
import { Link } from "react-router-dom";

const IsbnInputPage = () => {
  const [isbn, setIsbn] = useState("");
  return (
    <div className="flex flex-col items-center justify-start min-h-screen pt-28 space-y-12">
      <div className="flex flex-col items-center justify-center space-y-4">
        <BsKeyboard className="w-32 h-32" />
        <p className="text-5xl font-bold">직접 입력</p>
        <p className="text-2xl font-bold text-gray-500">
          책의 ISBN 번호를 입력하세요
        </p>
      </div>
      <div className="flex flex-col">
        <p className="text-gray-500 font-bold">ISBN(10자리 또는 13자리)</p>
        <input
          type="text"
          value={isbn}
          onChange={(e) => setIsbn(e.target.value)}
          placeholder="예: 9788937460449"
          className="bg-white text-gray-800 text-xl text-center w-[400px] py-3 rounded-lg shadow-lg shadow-indigo-500/50 transition-colors duration-200"
        />
      </div>
      <div className="flex flex-col space-y-3">
        <Link
          to="/isbn"
          className="bg-indigo-500 text-white text-xl text-center w-[400px] py-3 rounded-lg shadow-lg shadow-indigo-500/50 hover:bg-indigo-600 transition-colors duration-200"
        >
          책 찾기
        </Link>{" "}
        <Link
          to={`/my-review/${isbn}`}
          className="bg-indigo-200 text-gray-600 text-xl text-center w-[400px] py-3 rounded-lg shadow-lg shadow-indigo-500/50 hover:bg-indigo-300 transition-colors duration-200"
        >
          취소
        </Link>
      </div>
    </div>
  );
};

export default IsbnInputPage;
