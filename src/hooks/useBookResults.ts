import { useContext } from "react";
import BookResultsContext from "../contexts/BookResultsContext";

function useBookResults() {
  const {results} = useContext(BookResultsContext);

  const unselected: string[] = [];
  const selected: string[] = [];

  for (let i = 0; i < results.length; i++) {
    const result = results[i];
    if (results[i].selected) {
      selected.push(result.id);
    } else {
      unselected.push(result.id);
    }
  }

  return {
    unselected,
    selected,
  };
}

export default useBookResults;
