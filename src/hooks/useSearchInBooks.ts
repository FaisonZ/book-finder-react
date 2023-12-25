import { useContext, useEffect, useState } from "react";
import useFetchBookMetadatas from "./useFetchBookMetadatas";
import BookMetadataContext from "../contexts/BookMetadataContext";
import useBookResults from "./useBookResults";
import { findInBooks } from "../open-library/find-in-books";
import InBookResultsContext from "../contexts/InBookResultsContext";

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
      const bookUrlMap = new Map<string, string>();
      for (let i = 0; i < metadata.length; i++) {
        bookUrlMap.set(metadata[i].id, metadata[i].server);
      }

      const bookUrls = [];
      for (let i = 0; i < selected.length; i++) {
        if (bookUrlMap.has(selected[i])) {
          bookUrls.push(bookUrlMap.get(selected[i]) as string);
        }
      }

      findInBooks(query, bookUrls)
        .then((results) => {
          if (results.length) {
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
