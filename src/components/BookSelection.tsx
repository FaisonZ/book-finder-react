import useBookResults from "../hooks/useBookResults";
import useGetBooks from "../hooks/useGetBooks";
import useToggleResults from "../hooks/useToggleResults";

function BookSelection() {
  const toggleResult = useToggleResults();
  const { getBooksByIds } = useGetBooks();
  const { selected } = useBookResults();

  const books = getBooksByIds(selected);

  return (
    <div className="book-selection">
      <h2 className="title">Selected Books</h2>
      {books.length > 0 ? (
        <ul className="book-list">
          {books.map((book) => (
            <li
              className="book-list-item"
              key={`found-book-${book.id}`}
            >
              <p className="description">
                {book.title}
                <br />
                {`${book.publishYear}, ${book.author}`}
              </p>
              <button
                className="toggle -start"
                onClick={() => toggleResult(book.id)}
              >
                &lt;&lt;
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

export default BookSelection;
