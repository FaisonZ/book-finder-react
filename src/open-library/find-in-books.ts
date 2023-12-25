import { InBookResult } from "../contexts/InBookResultsContext";

interface InBookSearch {
  ia: string;
  q: string;
  indexed: boolean;
  matches: SearchResult[];
}

interface SearchResult {
  ia: string;
  text: string;
  par: {
    page: number;
  }[];
}

export async function findInBooks(
  query: string,
  bookUrls: string[]
): Promise<InBookResult[]> {
  const inBookRequests: Promise<InBookSearch>[] = new Array(bookUrls.length);

  for (let i = 0; i < bookUrls.length; i++) {
    const searchUrl = new URL(bookUrls[i]);
    searchUrl.searchParams.append('q', query);

    const inBookRequest = fetch(searchUrl)
      .then((response) => response.text())
      .then((text) => {
        // Fix the trailing slash that archive.org mistakenly includes.
        const fixedJson = text.replace("},\n]", "}\n]");
        return Promise.resolve(JSON.parse(fixedJson));
      });

      inBookRequests[i] = inBookRequest;
  }

  const inBookSearches = await Promise.all(inBookRequests);
  const inBookResults: InBookResult[] = [];

  for (let i = 0; i < inBookSearches.length; i++) {
    if (!inBookSearches[i].matches.length) {
      continue;
    }

    const matches = inBookSearches[i].matches;

    for (let j = 0; j < matches.length; j++) {
      inBookResults.push({
        bookId: inBookSearches[i].ia,
        text: matches[i].text,
        leafNumber: matches[i].par[0].page,
      });
    }
  }

  return inBookResults;
}
