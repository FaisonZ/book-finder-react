import { useContext, useState } from "react";
import BookResultsContext, { BookResult } from "../contexts/BookResultsContext";
import BooksContext from "../contexts/BooksContext";
import { findBooks } from "../open-library/search";

function useFetchBooks() {
  const [isFetching, setIsFetching] = useState(false);

  const { setBooks } = useContext(BooksContext);
  const { setResults } = useContext(BookResultsContext);

  async function fetchBooks(query: string) {
    setIsFetching(true);

    const books = await findBooks(query);

    if (!books.length) {
      return;
    }

    setBooks((prev) => {
      const updatedBooks = [...prev];
      const booksAdded = new Map<string, boolean>();

      for (let i = 0; i < prev.length; i++) {
        booksAdded.set(prev[i].id, true);
      }

      for (let i = 0; i < books.length; i++) {
        if (!booksAdded.has(books[i].id)) {
          updatedBooks.push(books[i]);
          booksAdded.set(books[i].id, true);
        }
      }

      return updatedBooks;
    });

    setResults((prev) => {
      const updatedResults: BookResult[] = [];
      const addedIDs = new Map<string, boolean>();

      for(let i = 0; i < prev.length; i++) {
        if (prev[i].selected) {
          updatedResults.push(prev[i]);
          addedIDs.set(prev[i].id, true);
        }
      }

      for(let i = 0; i < books.length; i++) {
        if (!addedIDs.has(books[i].id)) {
          updatedResults.push({
            id: books[i].id,
            selected: false,
          });
          addedIDs.set(books[i].id, true);
        }
      }

      return updatedResults;
    });

    setIsFetching(false);
  }

  return {
    isFetching,
    fetchBooks,
  };
}

export default useFetchBooks;
