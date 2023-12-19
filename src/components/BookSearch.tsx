import BookFinder from './BookFinder';
import BookSelection from './BookSelection';

import './BookSearch.scss';

function BookSearch() {

  return (
    <div className="book-search">
      <BookFinder />
      <BookSelection />
    </div>
  )
}

export default BookSearch;
