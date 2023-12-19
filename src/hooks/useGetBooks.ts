import { useContext } from "react";
import BooksContext from "../contexts/BooksContext";

function useGetBooks() {
  const {books} = useContext(BooksContext);

  function getBookById(id: string) {
    for (let i = 0; i < books.length; i++) {
      if (books[i].id === id) {
        return books[i];
      }
    }

    return null;
  }

  function getBooksByIds(ids: string[]) {
    const books = [] as {
      title: string,
      author: string,
      publishYear: number,
      id: string,
    }[];

    // TODO: Make this not O=n^2
    for (let i = 0; i < ids.length; i++) {
      let book = getBookById(ids[i]);
      if (book) {
        books.push(book);
      }
    }

    return books;
  }

  return {
    getBookById,
    getBooksByIds,
  }
}

export default useGetBooks;
