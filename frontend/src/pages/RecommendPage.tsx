import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../store/store';

interface BookRecommendation {
  isbn13: string;
  title: string;
  author: string;
  cover: string;
  description: string;
  publisher: string;
  pubDate: string;
  link: string;
}

const RecommendPage = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [isLoading, setIsLoading] = useState(true);
  const [recommendations, setRecommendations] = useState<BookRecommendation[]>(
    []
  );

  useEffect(() => {
    fetchRecommendations();
    // eslint-disable-next-line
  }, []);

  const fetchRecommendations = async () => {
    if (!user?.id) return;

    setIsLoading(true);
    try {
      const response = await fetch(
        'http://localhost:3000/api/books/recommend',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId: user.id }),
        }
      );

      const data = await response.json();
      setRecommendations(data.recommendations);
    } catch (error) {
      console.error('추천 에러:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="mt-20 flex justify-center">
        <p className="text-xl">✨ AI가 책을 추천하는 중...</p>
      </div>
    );
  }

  return (
    <div className="mt-20 mx-10">
      <h1 className="text-3xl font-bold mb-2">✨ AI 책 추천</h1>
      <p className="text-xl text-gray-600 mb-8">
        내가 읽은 책을 기반으로 AI가 추천해드려요 📚
      </p>
      {/* TODO: 추천 카드 리스트 */}
      <div className="space-y-4">
        {recommendations.map((book) => (
          <div
            key={book.isbn13}
            className="flex items-center gap-5 border rounded-2xl shadow-md p-5 bg-white hover:shadow-lg transition-shadow duration-200"
          >
            <div className="flex-shrink-0">
              <img
                src={book.cover || '/default_image.jpg'}
                alt={book.title}
                className="w-32 h-40 object-cover border rounded"
              />
            </div>

            <div className="flex flex-col justify-between flex-1 h-full">
              <div>
                <p className="text-xl font-bold text-gray-800">{book.title}</p>
                <p className="text-sm text-gray-500 mb-2">{book.author}</p>
                <p className="text-gray-700 line-clamp-3 mb-2">
                  {book.description}
                </p>
                <p className="text-sm text-gray-500">
                  {book.publisher} · {book.pubDate}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendPage;
