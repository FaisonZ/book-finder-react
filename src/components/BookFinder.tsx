import useBookResults from "../hooks/useBookResults";
import useFetchBooks from "../hooks/useFetchBooks";
import useGetBooks from "../hooks/useGetBooks";
import useToggleResults from "../hooks/useToggleResults";

function BookFinder() {
  const {isFetching, fetchBooks } = useFetchBooks();
  const toggleResult = useToggleResults();
  const { getBooksByIds } = useGetBooks();
  const { unselected } = useBookResults();

  const books = getBooksByIds(unselected);

  const findBooks = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const searchEl = e.currentTarget.elements.namedItem('search') as HTMLInputElement
    fetchBooks(searchEl.value);
  };

  return (
    <div className="book-finder">
      <form onSubmit={findBooks}>
        <input
          type="search"
          name="search"
          required
          minLength={4}
          disabled={isFetching}
        />
        <button type="submit" disabled={isFetching}>🔎</button>
      </form>
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
                className="toggle"
                onClick={() => toggleResult(book.id)}
              >
                &gt;&gt;
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

export default BookFinder;
