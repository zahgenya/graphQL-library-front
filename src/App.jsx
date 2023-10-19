import { useState } from 'react';
import { gql, useQuery } from '@apollo/client';

import Authors from './components/Authors';
import Books from './components/Books';
import NewBook from './components/NewBook';

import { ALL_AUTHORS } from './queries';

const App = () => {
  const [page, setPage] = useState('authors');

  const result = useQuery(ALL_AUTHORS);

  if (result.loading) {
    return <div>loading...</div>;
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        <button onClick={() => setPage('add')}>add book</button>
      </div>

      {page === 'authors' && <Authors authors={result.data.allAuthors} />}
      {page === 'books' && <Books />}

      <NewBook show={page === 'add'} />
    </div>
  );
};

export default App;
