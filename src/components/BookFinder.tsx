import BookList from "./BookList";
import useBookResults from "../hooks/useBookResults";
import useFetchBooks from "../hooks/useFetchBooks";
import useGetBooks from "../hooks/useGetBooks";

function BookFinder() {
  const {isFetching, fetchBooks } = useFetchBooks();
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
        <BookList books={books} selected={false} />
      ) : null}
    </div>
  );
}

export default BookFinder;
