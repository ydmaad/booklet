import MyReviewItem from "./MyReviewItem";

const MyReviewList = () => {
  const myReviews = [
    {
      cover: "/default_image.jpg",
      title: "데미안",
      author: "헤르만 헤세",
      memo: "자아를 찾는 여정이 정말 인상 깊었어요. 청춘의 불안함을 잘 표현한 책이에요.",
      stars: 4,
    },
    {
      cover: "/default_image.jpg",
      title: "82년생 김지영",
      author: "조남주",
      memo: "현실적이고 생각할 거리가 많은 작품이었어요.",
      stars: 5,
    },
    {
      cover: "/default_image.jpg",
      title: "노르웨이의 숲",
      author: "무라카미 하루키",
      memo: "고독하고 쓸쓸한 분위기가 너무 매력적이었어요. 인물들의 감정선이 깊게 와닿았어요.",
      stars: 4,
    },
    {
      cover: "/default_image.jpg",
      title: "죽은 시인의 사회",
      author: "N.H. 클라인바움",
      memo: "‘Carpe Diem’이라는 말이 가슴에 남아요. 자유와 억압의 대비가 인상적이에요.",
      stars: 5,
    },
    {
      cover: "/default_image.jpg",
      title: "총, 균, 쇠",
      author: "재레드 다이아몬드",
      memo: "인류 문명의 발전을 다르게 바라보게 되었어요. 조금 어렵지만 배울 게 많아요.",
      stars: 4,
    },
    {
      cover: "/default_image.jpg",
      title: "아몬드",
      author: "손원평",
      memo: "감정이란 무엇인가에 대해 생각하게 만드는 따뜻한 이야기였어요.",
      stars: 5,
    },
    {
      cover: "/default_image.jpg",
      title: "미드나잇 라이브러리",
      author: "매트 헤이그",
      memo: "후회와 선택의 무게를 잘 그려냈어요. 위로받는 느낌이 들었어요.",
      stars: 4,
    },
  ];
  return (
    <div className="mx-40">
      <h1 className="text-3xl font-bold text-gray-700 py-6">
        나의 독서 리스트
      </h1>

      <div className="flex flex-col gap-5">
        {myReviews.map((review, index) => (
          <MyReviewItem
            key={index}
            cover={review.cover}
            title={review.title}
            author={review.author}
            memo={review.memo}
            stars={review.stars}
          />
        ))}
      </div>
    </div>
  );
};

export default MyReviewList;
