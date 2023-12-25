import { PropsWithChildren, useState } from "react";
import InBookResultsContext, { InBookResult } from "../InBookResultsContext";

function InBookResultsProvider({ children }: PropsWithChildren) {
  const [results, setResults] = useState<InBookResult[]>([]);

  return (
    <InBookResultsContext.Provider value={{results, setResults}}>
      {children}
    </InBookResultsContext.Provider>
  );
}

export default InBookResultsProvider;
