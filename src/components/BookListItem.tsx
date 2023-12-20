import { Book } from "../contexts/BooksContext";

import "./BookListItem.scss";

function BookListItem({
  book,
  selected,
  onClick,
}: {
  book: Book;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <li className="book-list-item">
      <p className="description">
        {book.title}
        <br />
        {`${book.publishYear}, ${book.author}`}
      </p>
      <button
        className="toggle"
        onClick={onClick}
      >
        {selected ? 'x' : '+'}
      </button>
    </li>
  );
}

export default BookListItem;
