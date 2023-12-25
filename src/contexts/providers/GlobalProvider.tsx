import { PropsWithChildren } from "react";
import BooksProvider from "./BooksProvider";
import BookResultsProvider from "./BookResultsProvider";
import BookMetadataProvider from "./BookMetadataProvider";
import InBookResultsProvider from "./InBookResultsProvider";

function GlobalProvider({children}: PropsWithChildren) {
  return (
    <BooksProvider>
      <BookResultsProvider>
        <BookMetadataProvider>
          <InBookResultsProvider>
            {children}
          </InBookResultsProvider>
        </BookMetadataProvider>
      </BookResultsProvider>
    </BooksProvider>
  );
}

export default GlobalProvider;
