import { PropsWithChildren, useState } from "react";
import BooksContext, { Book } from "../BooksContext";

function BooksProvider({ children }: PropsWithChildren) {
  const [books, setBooks] = useState<Book[]>([]);

  return (
    <BooksContext.Provider value={{books, setBooks}}>
      {children}
    </BooksContext.Provider>
  );
}

export default BooksProvider;
