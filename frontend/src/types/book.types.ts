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
}
