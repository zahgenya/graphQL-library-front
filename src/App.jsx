import { useState } from 'react';
import { gql, useQuery } from '@apollo/client';

import Authors from './components/Authors';
import Books from './components/Books';
import NewBook from './components/NewBook';
import Notify from './components/Notify';
import BornForm from './components/BornForm';

import { ALL_AUTHORS } from './queries';

const App = () => {
  const [page, setPage] = useState('authors');
  const [errorMessage, setErrorMessage] = useState(null);

  const result = useQuery(ALL_AUTHORS);

  if (result.loading) {
    return <div>loading...</div>;
  }

  const notify = (message) => {
    setErrorMessage(message);
    setTimeout(() => {
      setErrorMessage(null);
    }, 5000);
  };

  return (
    <div>
      <Notify errorMessage={errorMessage} />
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        <button onClick={() => setPage('add')}>add book</button>
      </div>
      {page === 'authors' && (
        <>
          <Authors authors={result.data.allAuthors} />
          <BornForm setError={notify} authors={result.data.allAuthors}/>
        </>
      )}
      {page === 'books' && <Books />}

      {page === 'add' && <NewBook show={page === 'add'} setError={notify} />}
    </div>
  );
};
export default App;
