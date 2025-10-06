import type { Book } from "../types/book.types";

interface BookItemProp {
  book: Book;
}

const BookItem = ({ book }: BookItemProp) => {
  return (
    <div className="w-[150px] hover:shadow-lg transition-shadow duration-200">
      <div>
        <img
          src={book.cover}
          alt={book.title}
          className="object-contain h-52"
        />
      </div>
      <div className="text-lg font-bold truncate pt-3">{book.title}</div>
      <div className="truncate">{book.author}</div>
    </div>
  );
};

export default BookItem;
