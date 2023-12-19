import { useContext } from "react";
import BookResultsContext from "../contexts/BookResultsContext";

function useToggleResults() {
  const { setResults } = useContext(BookResultsContext);

  function toggleResult(bookID: string) {
    setResults((prev) => {
      const updatedResults = [];

      for(let i = 0; i < prev.length; i++) {
        const result = {...prev[i]};

        if (result.id === bookID) {
          result.selected = !result.selected;
        }

        updatedResults.push(result);
      }

      return updatedResults;
    })
  }

  return toggleResult;
}

export default useToggleResults;
