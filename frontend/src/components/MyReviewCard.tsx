import type { Review } from '../types/book.types';

interface MyReviewCardProps {
  review: Review;
}

const MyReviewCard = ({ review }: MyReviewCardProps) => {
  return (
    <div className="flex flex-col border border-gray-200 rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 bg-white w-full max-w-56 cursor-pointer">
      <div className="p-3">
        <div className="relative w-full pb-[135%] overflow-hidden rounded-lg">
          <img
            src={review.cover}
            alt={review.title}
            className="absolute top-0 left-0 w-full h-full object-cover"
          />
        </div>
        <div className="mt-3">
          <p className="text-sm font-semibold text-gray-800">{review.title}</p>
          <p className="mt-1 text-yellow-500 text-sm">
            {'⭐️'.repeat(review.stars)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MyReviewCard;
