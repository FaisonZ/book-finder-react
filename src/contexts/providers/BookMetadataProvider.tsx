import { PropsWithChildren, useState } from "react";
import BookMetadataContext, { BookMetadata } from "../BookMetadataContext";

function BookMetadataProvider({ children }: PropsWithChildren) {
  const [metadata, setMetadata] = useState<BookMetadata[]>([]);

  return (
    <BookMetadataContext.Provider value={{metadata, setMetadata}}>
      {children}
    </BookMetadataContext.Provider>
  );
}

export default BookMetadataProvider;
