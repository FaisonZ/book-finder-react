import BookSearch from './components/BookSearch';
import InBookSearch from './components/InBookSearch';
import GlobalProvider from './contexts/providers/GlobalProvider';

import './App.scss'

function App() {
  return (
    <GlobalProvider>
      <main className="book-search-app">
        <BookSearch />
        <InBookSearch />
      </main>
    </GlobalProvider>
  );
};

export default App;
