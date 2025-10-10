const EditProfile = () => {
  return (
    <div className="flex justify-center my-20">
      <div className="flex flex-col items-center w-1/4">
        <p className="text-3xl font-bold">내 정보 수정</p>
        <div className="flex flex-col justify-center items-center mb-10">
          <img
            src="/default_image.jpg"
            alt=""
            className="w-52 h-52 object-cover rounded-full m-10"
          />
          <button className="w-24 border text-sm text-white bg-gray-700 rounded-lg py-1">
            사진 업로드
          </button>
        </div>
        <div className="flex flex-col w-full mb-5">
          <p>닉네임</p>
          <div className="flex flex-row">
            <input
              type="text"
              placeholder="Value"
              className="border rounded-md px-2 py-1 flex-1 mr-1"
            />
            <button className="w-24 flex-shrink-0 border text-sm text-white bg-gray-700 rounded-lg py-1">
              중복 확인
            </button>
          </div>
        </div>
        <div className="flex flex-col w-full mb-5">
          <p>비밀번호</p>
          <input
            type="text"
            placeholder="Value"
            className="border rounded-md px-2 py-1 w-full"
          />
        </div>
        <div className="flex flex-col w-full mb-5">
          <p>비밀번호 확인</p>
          <input
            type="text"
            placeholder="Value"
            className="border rounded-md px-2 py-1 w-full"
          />
        </div>
        <div className="flex flex-col w-full mb-5">
          <p>나의 키워드</p>
          <input
            type="text"
            placeholder="Value"
            className="border rounded-md px-2 py-1 w-full"
          />
          <p className="text-sm text-gray-400">
            ex) 국내소설, 한강, 베스트셀러, 자기개발 등
          </p>
        </div>
        <div className="flex flex-col w-full mb-5">
          <p>한 줄 소개</p>
          <input
            type="text"
            placeholder="Value"
            className="border rounded-md px-2 py-1 w-full"
          />
        </div>
        <div className="flex gap-3 my-10">
          <button className="w-24 border border-gray-400 text-sm bg-white rounded-lg py-1">
            취소
          </button>
          <button className="w-24 text-sm text-white bg-[#ec221f] rounded-lg py-1">
            계정 삭제
          </button>
          <button className="w-24 text-sm text-white bg-gray-700 rounded-lg py-1">
            수정
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
