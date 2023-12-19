import { createContext } from "react";

export interface BookResult {
  id: string;
  selected: boolean;
};

const BookResultsContext = createContext<{
  results: BookResult[];
  setResults: React.Dispatch<React.SetStateAction<BookResult[]>>;
}>({
  results: [],
  setResults: () => null,
});

export default BookResultsContext;
