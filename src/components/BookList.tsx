import BookListItem from "./BookListItem";
import { Book } from "../contexts/BooksContext";
import useToggleResults from "../hooks/useToggleResults";

import "./BookList.scss"

function BookList({
  books,
  selected,
}: {
  books: Book[];
  selected: boolean;
}) {
  const toggleResult = useToggleResults();

  return (
    <ul className="book-list">
      {books.map((book) => (
        <BookListItem
          key={`found-book-${book.id}`}
          book={book}
          selected={selected}
          onClick={() => toggleResult(book.id)}
        />
      ))}
    </ul>
  );
}

export default BookList;
