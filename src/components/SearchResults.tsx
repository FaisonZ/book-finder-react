import { useContext } from "react";

import InBookResultsContext, { InBookResult } from "../contexts/InBookResultsContext";
import useGetBooks from "../hooks/useGetBooks";

function SearchResults() {
  const { results } = useContext(InBookResultsContext);

  const { getBookById } = useGetBooks();

  function getDeepLink(result: InBookResult) {
    const pageNumber = result.displayNumber ?? `n${result.pageNumber ?? (result.leafNumber - 1)}`;

    return `https://archive.org/details/${result.bookId}/page/${pageNumber}/`;
  }

  return (
    <ul>
      {results.length ? results.map((result, idx) => {
        const book = getBookById(result.bookId);

        return (
          <li key={`in-book-result-${idx}`}>
            <a href={getDeepLink(result)} target="_blank" rel="noreferrer noopener">
              {book?.title}, {result.displayNumber ?? result.pageNumber ?? result.leafNumber}
            </a>
            <br />
            {result.text}
          </li>
        );
      }) : null}
    </ul>
  );
}

export default SearchResults;
