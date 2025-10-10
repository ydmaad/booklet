import { HiOutlineBookmark } from "react-icons/hi";
import { useParams } from "react-router-dom";
import { FiEdit } from "react-icons/fi";
import { FiTrash2 } from "react-icons/fi";

const ReviewDetail = () => {
  const { reviewId } = useParams();
  return (
    <div className="my-20 mx-40">
      <div className="flex justify-between">
        <div className="flex flex-row">
          {/* 이미지 */}
          <div className="w-[170px] h-[233px] border mr-20"></div>
          {/* 책 정보 */}
          <div className="my-auto space-y-7">
            <p className="text-base">읽음</p>
            <div className="flex flex-row">
              <p className="text-5xl font-bold mr-3">데미안</p>
              <HiOutlineBookmark className="w-10 h-10 my-auto" />
            </div>
            <div className="flex flex-row text-gray-400">
              <p className="mr-4">민음사</p>
              <p className="mr-4">헤르만 헤세</p>
              <p>2009.10.20.</p>
            </div>
          </div>
        </div>
        <div className="flex flex-row gap-3 text-gray-500">
          <FiEdit className="w-6 h-6" />
          <FiTrash2 className="w-6 h-6" />
        </div>
      </div>
      <div className="border-t my-10 border-gray-300"></div>
      <div className="flex flex-row bg-gray-200 p-5 rounded-md">
        <div className="flex-shrink-0">
          <img
            src="/default_image.jpg"
            alt=""
            className="w-20 h-20 rounded-full object-cover mr-5"
          />
        </div>
        <div className="flex-shrink-0 mr-5">
          <p className="text-sm mb-2">2025-10-04</p>
          <p className="text-base mb-1">유저 닉네임</p>
          <p className="text-base">⭐️⭐️⭐️⭐️⭐️</p>
        </div>
        <div className="bg-white rounded-md p-2 flex-1">
          <p>
            인간 내면의 성장을 다룬 책이라 그런지 읽는 내내 마음이 흔들렸어요.
            특히 싱클레어가 자신의 ‘어둠’을 받아들이고 성장해가는 과정이
            인상적이었어요. 어른이 되면서 잊고 있던 감정과 고민들을 다시
            돌아보게 만드는 책입니다.인간 내면의 성장을 다룬 책이라 그런지 읽는
            내내 마음이 흔들렸어요. 특히 싱클레어가 자신의 ‘어둠’을 받아들이고
            성장해가는 과정이 인상적이었어요. 어른이 되면서 잊고 있던 감정과
            고민들을 다시 돌아보게 만드는 책입니다.인간 내면의 성장을 다룬
            책이라 그런지 읽는 내내 마음이 흔들렸어요. 특히 싱클레어가 자신의
            ‘어둠’을 받아들이고 성장해가는 과정이 인상적이었어요. 어른이 되면서
            잊고 있던 감정과 고민들을 다시 돌아보게 만드는 책입니다.인간 내면의
            성장을 다룬 책이라 그런지 읽는 내내 마음이 흔들렸어요. 특히
            싱클레어가 자신의 ‘어둠’을 받아들이고 성장해가는 과정이
            인상적이었어요. 어른이 되면서 잊고 있던 감정과 고민들을 다시
            돌아보게 만드는 책입니다.인간 내면의 성장을 다룬 책이라 그런지 읽는
            내내 마음이 흔들렸어요. 특히 싱클레어가 자신의 ‘어둠’을 받아들이고
            성장해가는 과정이 인상적이었어요. 어른이 되면서 잊고 있던 감정과
            고민들을 다시 돌아보게 만드는 책입니다.인간 내면의 성장을 다룬
            책이라 그런지 읽는 내내 마음이 흔들렸어요. 특히 싱클레어가 자신의
            ‘어둠’을 받아들이고 성장해가는 과정이 인상적이었어요. 어른이 되면서
            잊고 있던 감정과 고민들을 다시 돌아보게 만드는 책입니다.인간 내면의
            성장을 다룬 책이라 그런지 읽는 내내 마음이 흔들렸어요. 특히
            싱클레어가 자신의 ‘어둠’을 받아들이고 성장해가는 과정이
            인상적이었어요. 어른이 되면서 잊고 있던 감정과 고민들을 다시
            돌아보게 만드는 책입니다.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReviewDetail;
