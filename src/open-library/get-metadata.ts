import { BookMetadata } from "../contexts/BookMetadataContext";

interface EditionMetaData {
  server :string;
  dir: string;
  metadata: {
    identifier: string;
    "identifier-access": string;
  };
  page_numbers?: {
    pages: {
      leafNum: number;
      pageNumber: string;
    }[];
  };
}

const ENDPOINT = 'https://archive.org/metadata/';

export async function getMetadata(bookIds: string[]): Promise<BookMetadata[]> {
  const metaRequests: Promise<EditionMetaData>[] = [];

  for(let i = 0; i < bookIds.length; i++) {
    const metaRequest = fetch(ENDPOINT + bookIds[i])
      .then((response) => response.json());
    metaRequests.push(metaRequest);
  }

  const editionMetadatas = await Promise.all(metaRequests);

  const metaDatas: BookMetadata[] = [];

  for (let i = 0; i < editionMetadatas.length; i++) {
    const meta = editionMetadatas[i];

    const serverUrl = new URL(`https://${meta.server}/fulltext/inside.php`);
    serverUrl.searchParams.append('item_id', meta.metadata.identifier);
    serverUrl.searchParams.append('doc', meta.metadata.identifier);
    serverUrl.searchParams.append('path', meta.dir);

    let pages: BookMetadata['pages'] | null = null;

    if (meta.page_numbers) {
      const pageNumbers = meta.page_numbers.pages;
      pages = new Array(pageNumbers.length);

      for(let p = 0; p < pageNumbers.length; p++) {
        pages[p] = {
          leafNumber: pageNumbers[p].leafNum,
          pageNumber: pageNumbers[p].pageNumber,
        };
      }
    }

    metaDatas.push({
      id: meta.metadata.identifier,
      server: serverUrl.toString(),
      pages: pages ?? [],
    });
  }

  return metaDatas;
}
