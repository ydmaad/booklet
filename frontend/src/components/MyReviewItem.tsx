interface MyReviewItemProps {
  cover: string;
  title: string;
  author: string;
  memo: string;
  stars: number;
}

const MyReviewItem = ({
  cover,
  title,
  author,
  memo,
  stars,
}: MyReviewItemProps) => {
  return (
    <div className="flex items-center gap-5 border rounded-2xl shadow-md p-5 bg-white hover:shadow-lg transition-shadow duration-200 cursor-pointer">
      <div className="flex-shrink-0">
        <img
          src={cover || "/default_image.jpg"}
          alt={title}
          className="w-32 h-40 object-cover border"
        />
      </div>

      <div className="flex flex-col justify-between flex-1 h-full">
        <div>
          <p className="text-xl font-bold text-gray-800">{title}</p>
          <p className="text-sm text-gray-500 mb-2">{author}</p>
          <p className="text-gray-700 line-clamp-3">{memo}</p>
        </div>
        <div className="mt-3  text-lg">{"⭐️ ".repeat(stars)}</div>
      </div>
    </div>
  );
};

export default MyReviewItem;
