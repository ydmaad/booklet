export interface Book {
  title: string;
  author: string;
  pubDate: string;
  description: string;
  isbn13: string;
  cover: string;
  publisher: string;
}

export interface AladinResponse {
  version: string;
  logo: string;
  title: string;
  item: Book[];
}

export interface BooksState {
  items: AladinResponse;
  loading: boolean;
  error: string | null;
  currentBook: Book | null; // 추가!
}

export interface Review {
  id: string;
  cover: string;
  title: string;
  author: string;
  memo: string;
  stars: number;
  user_id: string;
  status: string;
  publisher: string;
  pubDate: string;
  created_at: string;
}

export type ReadStatus =
  | '📘 읽고 싶은'
  | '📖 읽는 중'
  | '✅ 읽음'
  | '⏸ 잠시 멈춤'
  | '⛔ 중단'
  | '';
