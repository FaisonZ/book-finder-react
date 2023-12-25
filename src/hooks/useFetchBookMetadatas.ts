import { useContext, useState } from "react";
import BookMetadataContext from "../contexts/BookMetadataContext";
import { getMetadata } from "../open-library/get-metadata";

function useFetchBookMetadatas() {
  const [isFetching, setIsFetching] = useState(false);

  const { metadata, setMetadata } = useContext(BookMetadataContext);

  async function fetchBookMetadatas(bookIds: string[]) {
    setIsFetching(true);

    const booksFetched = new Map<string, boolean>();
    for (let i = 0; i < metadata.length; i++) {
      booksFetched.set(metadata[i].id, true);
    }

    const booksToFetch = [];
    for(let i = 0; i < bookIds.length; i++) {
      if (!booksFetched.has(bookIds[i])) {
        booksToFetch.push(bookIds[i]);
      }
    }

    if (booksToFetch.length) {
      const newMetas = await getMetadata(booksToFetch);
      setMetadata((prev) => [...prev, ...newMetas]);
    }

    setIsFetching(false);
  }

  return {
    isFetching,
    fetchBookMetadatas,
  };
}

export default useFetchBookMetadatas;
