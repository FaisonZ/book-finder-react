import { useCallback, useEffect, useState } from 'react'
import { Edition, EditionMetaData, SearchResult, Work, WorkSearch } from './types/open-library'

import './App.css'

const SEARCH_ENDPOINT = 'https://openlibrary.org/search.json';
const META_ENDPOINT = 'https://archive.org/metadata/';
const FIELDS = [
  'key',
  'type',
  'title',
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
]

interface BookSearch {
  status: 'waiting' | 'loading' | 'done';
  results: Work[]
}

interface InBookSearch {
  ia: string;
  q: string;
  indexed: boolean;
  matches: SearchResult[];
}

interface InBook {
  status: 'waiting' | 'loadingMeta' | 'loading' | 'done';
  results: SearchResult[];
}

function hashCode(s: string) {
  return s.split('').reduce(function(a, b) {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
}

function App() {
  const [bookSearchValue, setBookSearchValue] = useState('');
  const [bookSearch, setBookSearch] = useState<BookSearch>({
    status: 'waiting',
    results: [],
  });
  const [booksSelected, setBooksSelected] = useState<Edition["ia"]>([]);
  const [inBookSearchValue, setInBookSearchValue] = useState('');
  const [bookMetaDatas, setBookMetaDatas] = useState<EditionMetaData[]>([]);
  const [inBookSearch, setInBookSearch] = useState<InBook>({
    status: 'waiting',
    results: [],
  });

  const findBooks = useCallback((search: string) => {
    const searchUrl = new URL(SEARCH_ENDPOINT);
    searchUrl.searchParams.append('q', `${search} language:eng has_fulltext:true ebook_access:public`)
    searchUrl.searchParams.append('fields', FIELDS.join(','))

    setBookSearch((prev) => ({
      ...prev,
      status: 'loading',
    }));

    const abortController = new AbortController();

    fetch(searchUrl, {
      signal: abortController.signal,
    }).then((response) => {
      return response.json();
    }).then((json: WorkSearch) => {
      setBooksSelected([]);
      setBookSearch({
        status: 'done',
        results: json.docs
      });
    });

    return () => abortController.abort();
  }, [setBookSearch]);

  const findInBooks = useCallback((search: string, books: Edition["key"][]) => {
    // Get meta data for each book
    const abortController = new AbortController();

    setInBookSearch((prev) => ({
      ...prev,
      status: 'loadingMeta',
    }));

    const metaRequests = books.map(
      (bookKey) => fetch(
        META_ENDPOINT + bookKey,
        {
          signal: abortController.signal,
        },
      )
      .then((response) => response.json())
    );

    Promise.all(metaRequests).then((metas: EditionMetaData[]) => {
      const parsedBookMeta: EditionMetaData[] = metas.map((meta) => ({
        server: meta.server,
        dir: meta.dir,
        metadata: {
          identifier: meta.metadata.identifier,
          'identifier-access': meta.metadata['identifier-access'],
        },
      }));

      setBookMetaDatas(parsedBookMeta);
      setInBookSearch((prev) => ({
        ...prev,
        status: 'loading',
      }));
    });
    // Then search in each book
    // Save search results in state for display

    return () => abortController.abort();
  }, [setInBookSearch, setBookMetaDatas]);

  useEffect(() => {
    if (inBookSearch.status === 'loading' && bookMetaDatas.length > 0) {
      const searchResponses = bookMetaDatas.map((meta) => {
        const searchUrl = new URL(`https://${meta.server}/fulltext/inside.php`);
        searchUrl.searchParams.append('item_id', meta.metadata.identifier);
        searchUrl.searchParams.append('doc', meta.metadata.identifier);
        searchUrl.searchParams.append('path', meta.dir);
        searchUrl.searchParams.append('q', inBookSearchValue);

        return fetch(
          searchUrl,
        ).then((response) => response.text()
        ).then((text) => {
          // Fix the trailing slash that archive.org mistakenly includes.
          const fixedJson = text.replace("},\n]", "}\n]");
          return Promise.resolve(JSON.parse(fixedJson));
        });
      });

      Promise.all(searchResponses).then((allSearchResults: InBookSearch[]) => {
        const allResults: SearchResult[] = [];
        allSearchResults.forEach((searchResults) => {
          searchResults.matches.forEach((match) => {
            allResults.push({
              ia: match.ia,
              text: match.text,
              par: [{
                page: match.par[0].page
              }],
              link: `https://archive.org/details/${searchResults.ia}/page/n${match.par[0].page}/`,
            });
          });
        });

        setInBookSearch({
          status: 'done',
          results: allResults,
        });
      });
    }
  }, [inBookSearch.status, inBookSearchValue, bookMetaDatas, setInBookSearch]);

  return (
    <main>
      <h1>Hello Book Finder</h1>

      {bookSearch.status === 'done' && (
        <div>
          <label>Search in {booksSelected.length} books: </label>
          <input
            type="text"
            value={inBookSearchValue}
            onChange={(e) => setInBookSearchValue(e.target.value)}
          />
          <button onClick={() => findInBooks(inBookSearchValue, booksSelected)}>Find in Books</button>
        </div>
      )}
      {inBookSearch.status === 'loadingMeta' && (
        <p>Fetching meta data...</p>
      )}
      {inBookSearch.status === 'loading' && (
        <p>Searching in books...</p>
      )}
      {inBookSearch.status === 'done' && inBookSearch.results.length === 0 && (
        <p>No results found</p>
      )}
      {inBookSearch.status === 'done' && inBookSearch.results.length > 0 && (
        <>
          <p>{inBookSearch.results.length} results:</p>
          <ul>
            {inBookSearch.results.map((result) => (
              <li key={`result_${hashCode(result.text)}`}>
                <blockquote>
                  {result.text}
                </blockquote>
                <a href={result.link} target="_blank" rel="noreferrer noopener">
                  Go to result
                </a>
              </li>
            ))}
          </ul>
        </>
      )}
      <div>
        <label>Search for Books: </label>
        <input
          type="text"
          value={bookSearchValue}
          onChange={(e) => setBookSearchValue(e.target.value)}
        />
        <button onClick={() => findBooks(bookSearchValue)}>Find Books</button>
      </div>
      {bookSearch.status === 'loading' && (
        <p>Searching...</p>
      )}
      {bookSearch.status === 'done' && (
        <ul>
        {bookSearch.results.map((work) => {
          const ed = work.editions.docs[0];
          return (
            <li key={ed.key}>
              <label>
                <input
                  type="checkbox"
                  checked={booksSelected.includes(ed.ia[0])}
                  onChange={(e) => setBooksSelected((prev) => {
                    if (e.target.checked) {
                      return [...prev, ed.ia[0]];
                    } else {
                      return prev.filter((item) => item !== ed.ia[0]);
                    }
                  })}
                />
                {`(${work.first_publish_year}) `}
                {ed.subtitle ? `${ed.title}; ${ed.subtitle}` : ed.title}
                {' '}
                <a href={`https://archive.org/details/${ed.ia[0]}`} target="_blank" rel="noreferrer noopener">
                  {`<<${ed.ia[0]}>>`}
                </a>
              </label>
            </li>
          )
        })}
        </ul>
      )}
    </main>
  )
}

export default App
