import { Book } from "../contexts/BooksContext";

interface WorkSearch {
  numFound: number;
  start: number;
  numFoundExact: boolean;
  docs: Work[];
}

interface Work {
  key: string;
  type: "work"
  title: string;
  author_name?: string[];
  first_publish_year: number;
  ebook_access: "public" | "borrowable" | "printdisabled" | "no_ebook";
  editions: {
    docs: Edition[];
  };
}

interface Edition {
  key: string;
  type: "edition";
  title: string;
  subtitle?: string;
  publish_year: number[];
  ebook_access: "public" | "borrowable" | "printdisabled";
  ia: string[];
  has_fulltext: boolean;
}

const ENDPOINT = 'https://openlibrary.org/search.json';
const QUERY_CONFIG = [
  'language:eng',
  'has_fulltext:true',
  'ebook_access:public',
];
const FIELDS = [
  'key',
  'type',
  'title',
  'author_name',
  'first_publish_year',
  'ebook_access',
  'editions',
  'editions.key',
  'editions.type',
  'editions.title',
  'editions.subtitle',
  'editions.publish_year',
  'editions.ebook_access',
  'editions.ia',
  'editions.has_fulltext',
];

export async function findBooks(query: string): Promise<Book[]> {
  const searchUrl = new URL(ENDPOINT);
  const fullQuery = `${query} ${QUERY_CONFIG.join(' ')}`.trim();
  searchUrl.searchParams.append('q', fullQuery);
  searchUrl.searchParams.append('fields', FIELDS.join(','));

  const response = await fetch(searchUrl);
  const results: WorkSearch = await response.json();

  const books: Book[] = [];

  for(let i = 0; i < results.docs.length; i++) {
    const work = results.docs[i];
    const workEdition = work.editions.docs[0];
    const titleParts = [workEdition.title];
    let author = '[unknown]';

    if (workEdition.subtitle) {
      titleParts.push(workEdition.subtitle);
    }

    if (work.author_name && work.author_name.length) {
      author = work.author_name[0];
    }

    const book: Book = {
      id: workEdition.ia[0],
      title: titleParts.join('; '),
      author,
      publishYear: workEdition.publish_year?.length ? workEdition.publish_year[0] : 0,
    }

    books.push(book);
  }

  return books;
}
