import { useContext, useEffect, useState } from "react";
import useFetchBookMetadatas from "./useFetchBookMetadatas";
import BookMetadataContext, { BookMetadata } from "../contexts/BookMetadataContext";
import useBookResults from "./useBookResults";
import { findInBooks } from "../open-library/find-in-books";
import InBookResultsContext from "../contexts/InBookResultsContext";
import { Book } from "../contexts/BooksContext";

function useSearchInBooks() {
  const [isSearching, setIsSearching] = useState(false);
  const [query, setQuery] = useState('');

  const { metadata } = useContext(BookMetadataContext);
  const { setResults } = useContext(InBookResultsContext);
  const { selected } = useBookResults();
  const { isFetching, fetchBookMetadatas } = useFetchBookMetadatas();

  async function searchInBooks(searchQuery: string) {
    setIsSearching(true);
    setQuery(searchQuery);
    setResults([]);
    console.log('search start');
    console.log('fetching meta!');
    fetchBookMetadatas(selected);
  }

  useEffect(() => {
    let abortController: AbortController | null;

    if (isSearching && !isFetching) {
      console.log('searching!');
      const bookUrlMap = new Map<Book['id'], BookMetadata['server']>();
      for (let i = 0; i < metadata.length; i++) {
        bookUrlMap.set(metadata[i].id, metadata[i].server);
      }

      const bookUrls = [];
      for (let i = 0; i < selected.length; i++) {
        if (bookUrlMap.has(selected[i])) {
          bookUrls.push(bookUrlMap.get(selected[i]) as string);
        }
      }

      const bookPagesMap = new Map<Book['id'], BookMetadata['pages']>();
      for (let i = 0; i < metadata.length; i++) {
        bookPagesMap.set(metadata[i].id, metadata[i].pages);
      }

      findInBooks(query, bookUrls)
        .then((results) => {
          if (results.length) {
            for (let i = 0; i < results.length; i++) {
              const bookPages = bookPagesMap.get(results[i].bookId) as BookMetadata['pages'];
              const pageNumber = bookPages.findIndex((page) => page.leafNumber === results[i].leafNumber);

              if (pageNumber >= 0) {
                results[i].pageNumber = pageNumber
                results[i].displayNumber = bookPages[pageNumber].pageNumber || undefined;
              }
            }

            setResults(results);
          }
          console.log('search stop');
          console.log(results.length);
          setIsSearching(false);
        });
    }

    return () => abortController?.abort();
  }, [isSearching, isFetching, query, selected, metadata]);


  return {
    isSearching,
    searchInBooks,
  }
}

export default useSearchInBooks;
