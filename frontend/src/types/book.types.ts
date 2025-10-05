export interface Book {
  title: string;
  author: string;
  pubDate: string;
  description: string;
  isbn13: string;
  cover: string;
  publisher: string;
}

export interface BooksState {
  items: Book[];
  loading: boolean;
  error: string | null;
}
