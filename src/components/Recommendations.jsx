import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { FAVORITE_GENRES, ALL_BOOKS } from '../queries';

const Recommendations = () => {
  const {
    loading: userLoading,
    error: userError,
    data: userData,
  } = useQuery(FAVORITE_GENRES);

  const [genreToSearch, setGenreToSearch] = useState('');

  useEffect(() => {
    if (
      userData &&
      userData.me &&
      userData.me.favoriteGenres &&
      userData.me.favoriteGenres.length > 0
    ) {
      setGenreToSearch(userData.me.favoriteGenres[0]);
    }
  }, [userData]);

  const {
    loading: booksLoading,
    error: booksError,
    data: booksData,
  } = useQuery(ALL_BOOKS, {
    variables: { genre: genreToSearch },
    skip: !genreToSearch,
  });

  if (userLoading || booksLoading) {
    return <div>Loading...</div>;
  }

  if (userError || booksError) {
    return (
      <div>Error: {userError ? userError.message : booksError.message}</div>
    );
  }

  if (genreToSearch && booksData && booksData.allBooks) {
    const booksToShow = booksData.allBooks;

    return (
      <div>
        <h2>Recommendations</h2>
        <p>Books in your favorite genre: {genreToSearch}</p>
        <table>
          <tbody>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Published</th>
            </tr>
            {booksToShow.map((book) => (
              <tr key={book.title}>
                <td>{book.title}</td>
                <td>{book.author.name}</td>
                <td>{book.published}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  } else {
    return <p>No books found in your favorite genre.</p>;
  }
};

export default Recommendations;
