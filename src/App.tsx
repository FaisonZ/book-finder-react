import { useCallback, useState } from 'react'
import { Edition, Work, WorkSearch } from './types/open-library'

import './App.css'

const SEARCH_ENDPOINT = 'https://openlibrary.org/search.json';
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

function App() {
  const [bookSearchValue, setBookSearchValue] = useState('');
  const [bookSearch, setBookSearch] = useState<BookSearch>({
    status: 'waiting',
    results: [],
  });
  const [booksSelected, setBooksSelected] = useState<Edition["key"][]>([]);

  const findBooks = useCallback((search: string) => {
    const searchUrl = new URL(SEARCH_ENDPOINT);
    searchUrl.searchParams.append('q', `${search} language:eng has_fulltext:true`)
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
      console.log(json);
      setBookSearch({
        status: 'done',
        results: json.docs
      });
    });

  }, [setBookSearch]);

  return (
    <main>
      <h1>Hello Book Finder</h1>

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
              <input
                type="checkbox"
                onChange={(e) => setBooksSelected((prev) => {
                  if (e.target.checked) {
                    return [...prev, ed.key];
                  } else {
                    return prev.filter((item) => item !== ed.key);
                  }
                })}
              />
              {ed.subtitle ? `${ed.title}; ${ed.subtitle}` : ed.title}
              {`<<${ed.ia[0]}>>`}
            </li>
          )
        })}
        </ul>
      )}
    </main>
  )
}

export default App
