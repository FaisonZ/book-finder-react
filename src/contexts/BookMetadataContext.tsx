import { createContext } from "react";

export interface BookMetadata {
  id: string;
  server: string;
  pages: {
    leafNumber: number;
    pageNumber: string;
  }[];
}

const BookMetadataContext = createContext<{
  metadata: BookMetadata[];
  setMetadata: React.Dispatch<React.SetStateAction<BookMetadata[]>>;
}>({
  metadata: [],
  setMetadata: () => null,
});

export default BookMetadataContext;
