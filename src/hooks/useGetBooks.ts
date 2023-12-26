import { useContext } from "react";
import BooksContext, { Book } from "../contexts/BooksContext";

function useGetBooks() {
  const {books} = useContext(BooksContext);

  function getBooksByIds(ids: string[]) {
    const booksToReturn = [] as Book[];

    const booksMap = new Map<Book['id'], Book>();

    let bIdx = 0;
    for (let i = 0; i < ids.length; i++) {
      if (booksMap.has(ids[i])) {
        booksToReturn.push(booksMap.get(ids[i]) as Book);
        continue;
      }

      while (bIdx < books.length) {
        const storedBook = books[bIdx++];
        booksMap.set(storedBook.id, storedBook);

        if (storedBook.id === ids[i]) {
          booksToReturn.push(storedBook);
          break;
        }
      }
    }

    return booksToReturn;
  }

  return {
    getBooksByIds,
  }
}

export default useGetBooks;
