import { PropsWithChildren, useState } from "react";
import BookResultsContext, { BookResult } from "../BookResultsContext";

function BookResultsProvider({ children }: PropsWithChildren) {
  const [results, setResults] = useState<BookResult[]>([]);

  return (
    <BookResultsContext.Provider value={{results, setResults}}>
      {children}
    </BookResultsContext.Provider>
  );
}

export default BookResultsProvider;
