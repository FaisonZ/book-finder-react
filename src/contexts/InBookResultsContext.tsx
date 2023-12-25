import { createContext } from "react";

export interface InBookResult {
  bookId: string;
  text: string;
  leafNumber: number;
};

const InBookResultsContext = createContext<{
  results: InBookResult[];
  setResults: React.Dispatch<React.SetStateAction<InBookResult[]>>;
}>({
  results: [],
  setResults: () => null,
});

export default InBookResultsContext;
