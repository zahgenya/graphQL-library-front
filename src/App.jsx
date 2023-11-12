import { useState } from 'react';
import { gql, useQuery, useApolloClient } from '@apollo/client';

import Authors from './components/Authors';
import Books from './components/Books';
import NewBook from './components/NewBook';
import Notify from './components/Notify';
import BornForm from './components/BornForm';
import LoginForm from './components/LoginForm';

import { ALL_AUTHORS } from './queries';

const App = () => {
  const [token, setToken] = useState(null);
  const [page, setPage] = useState('authors');
  const [errorMessage, setErrorMessage] = useState(null);

  const client = useApolloClient();

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

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }

  if (!token) {
    return (
      <div>
        <Notify errorMessage={errorMessage} />
        <h2>Login</h2>
        <LoginForm setError={notify} setToken={setToken} />
      </div>
    );
  }

  return (
    <div>
      <Notify errorMessage={errorMessage} />
      <button onClick={logout}>logout</button>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        <button onClick={() => setPage('add')}>add book</button>
      </div>
      {page === 'authors' && (
        <>
          <Authors authors={result.data.allAuthors} />
          <BornForm setError={notify} authors={result.data.allAuthors} />
        </>
      )}
      {page === 'books' && <Books />}

      {page === 'add' && <NewBook show={page === 'add'} setError={notify} />}
    </div>
  );
};
export default App;
