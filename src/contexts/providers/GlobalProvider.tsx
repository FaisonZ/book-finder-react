import { PropsWithChildren } from "react";
import BooksProvider from "./BooksProvider";
import BookResultsProvider from "./BookResultsProvider";

function GlobalProvider({children}: PropsWithChildren) {
  return (
    <BooksProvider>
      <BookResultsProvider>
        {children}
      </BookResultsProvider>
    </BooksProvider>
  );
}

export default GlobalProvider;
