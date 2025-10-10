import { FiEdit } from "react-icons/fi";
import { LuShare } from "react-icons/lu";
import { FaSearch } from "react-icons/fa";

const MyPage = () => {
  return (
    <div className="flex flex-row justify-start mt-20">
      <div className="flex flex-col items-center mx-10">
        <p className="text-3xl font-bold">내 서재</p>
        <img
          src="/default_image.jpg"
          alt=""
          className="w-52 h-52 object-cover rounded-full my-10"
        />
        <div className="flex flex-row">
          <p className="text-xl font-bold mr-1">유저닉네임</p>
          <FiEdit className="w-4 h-4 cursor-pointer mt-1 text-gray-500" />
        </div>
        <p className="text-base font-bold underline text-gray-500">
          xxxxxx@xxxxxx.com
        </p>
        <div className="border flex flex-1 flex-col w-full p-5 rounded-lg mt-5">
          <p className="text-base font-bold">나의 키워드</p>
          <p>#소설 #책 #책좋아하고싶어요 #잡지</p>
          <p className="text-base font-bold">한 줄 소개</p>
          <p>안녕하세요. 저 책 잘 안 읽어서 왔어요. 다그쳐주세요.</p>
        </div>
      </div>
      <div className="border border-blue-500 flex-1 ">
        <div className="rounded-full border justify-between flex flex-row">
          <input type="text" placeholder="Search" />
          <FaSearch />
        </div>
        <LuShare className="ml-auto block w-7 h-7" />
        <div className="grid grid-cols-3 gap-8">
          {[...Array(9)].map((_, idx) => (
            <div key={idx} className="border border-red-500 flex flex-col py-4">
              <div className="mx-auto">
                <div className="border w-44 h-56 mx-auto">
                  <img src="" alt="" />
                </div>
                <p className="text-lg mt-3">데미안</p>
                <p>⭐️⭐️⭐️⭐️⭐️</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyPage;
