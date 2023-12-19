import { createContext } from "react";

export interface Book {
  id: string;
  title: string;
  publishYear: number;
  author: string;
};

const BooksContext = createContext<{
  books: Book[];
  setBooks: React.Dispatch<React.SetStateAction<Book[]>>;
}>({
  books: [],
  setBooks: () => null,
});

export default BooksContext;
