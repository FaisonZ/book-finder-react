import useSearchInBooks from "../hooks/useSearchInBooks";
import SearchResults from "./SearchResults";

function InBookSearch() {
  const { isSearching, searchInBooks } = useSearchInBooks();

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
      <SearchResults />
    </div>
  )
}

export default InBookSearch;
