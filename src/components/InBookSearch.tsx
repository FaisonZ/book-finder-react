import { useContext } from "react";
import useSearchInBooks from "../hooks/useSearchInBooks";
import InBookResultsContext from "../contexts/InBookResultsContext";

function InBookSearch() {
  const { isSearching, searchInBooks } = useSearchInBooks();
  const { results } = useContext(InBookResultsContext);

  const findInBooks = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const searchEl = e.currentTarget.elements.namedItem('in-book-search') as HTMLInputElement
    console.log(searchEl.value);
    searchInBooks(searchEl.value);
  };

  return (
    <div className="in-book-search">
      <form onSubmit={findInBooks}>
        <input
          type="search"
          name="in-book-search"
          required
          minLength={3}
          disabled={isSearching}
        />
        <button type="submit" disabled={isSearching}>🔎</button>
      </form>
      {results.length ? (
        <ul>
          {results.map((results, idx) => (
            <li key={`in-book-result-${idx}`}>
              {results.text}<br />
              {results.leafNumber}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}

export default InBookSearch;
