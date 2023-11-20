import { useState } from 'react';
import { gql, useQuery, useApolloClient, useSubscription } from '@apollo/client';

import Authors from './components/Authors';
import Books from './components/Books';
import NewBook from './components/NewBook';
import Notify from './components/Notify';
import BornForm from './components/BornForm';
import LoginForm from './components/LoginForm';
import Recommendations from './components/Recommendations';

import { ALL_AUTHORS, ALL_BOOKS, BOOK_ADDED } from './queries';

export const updateCache = (cache, query, addedBook) => {
  const uniqByTitle = (a) => {
    let seen = new Set()
    return a.filter((item) => {
      let k = item.title
      return seen.has(k) ? false : seen.add(k)
    })
  }

  cache.updateQuery(query, ({ allBooks }) => {
    return {
      allBooks: uniqByTitle(allBooks.concat(addedBook)),
    }
  })
}

const App = () => {
  const [token, setToken] = useState(null);
  const [page, setPage] = useState('authors');
  const [errorMessage, setErrorMessage] = useState(null);
  const client = useApolloClient();
  const result = useQuery(ALL_AUTHORS);

  useSubscription(BOOK_ADDED, {
    onData: ({ data }) => {
      const addedBook = data.data.bookAdded
      notify(`${addedBook} added`)
      updateCache(client.cache, { query: ALL_BOOKS }, addedBook)
    },
  })

  if (result.loading) {
    return <div>loading...</div>;
  }

  const notify = (message) => {
    setErrorMessage(message);
    setTimeout(() => {
      setErrorMessage(null);
    }, 5000);
  };

  const logout = () => {
    setToken(null);
    localStorage.clear();
    client.resetStore();
  };

  if (!token) {
    return (
      <>
        <Notify errorMessage={errorMessage} />
        <LoginForm setToken={setToken} setError={notify} setPage={setPage} />
      </>
    )
  }

  return (
    <div>
      <Notify errorMessage={errorMessage} />
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        {token ? (
          <>
            <button onClick={() => setPage('add')}>add book</button>
            <button onClick={() => setPage('recommendations')}>recommend</button>
            <button onClick={logout}>logout</button>
          </>
        ) : (
          <button onClick={() => setPage('login')}>login</button>
        )}
      </div>

      {page === 'authors' && (
        <>
          <Authors authors={result.data.allAuthors} />
          {token !== null && (
            <BornForm setError={notify} authors={result.data.allAuthors} />
          )}
        </>
      )}
      {page === 'books' && <Books />}

      {page === 'add' && <NewBook show={page === 'add'} setError={notify} />}

      {page === 'login' && (
        <LoginForm setError={notify} setToken={setToken} setPage={setPage} />
      )}

      {page === 'recommendations' && (
        <Recommendations />
      )}
    </div>
  );
};
export default App;
