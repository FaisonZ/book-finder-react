import BookList from "./BookList";
import useBookResults from "../hooks/useBookResults";
import useGetBooks from "../hooks/useGetBooks";

import "./BookSelection.scss";

function BookSelection() {
  const { getBooksByIds } = useGetBooks();
  const { selected } = useBookResults();

  const books = getBooksByIds(selected);

  return (
    <div className="book-selection">
      <h2 className="title">Selected Books</h2>
      {books.length > 0 ? (
        <BookList books={books} selected={true} />
      ) : null}
    </div>
  );
}

export default BookSelection;
