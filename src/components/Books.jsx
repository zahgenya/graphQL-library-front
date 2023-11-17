import { ALL_BOOKS } from '../queries';
import { useQuery } from '@apollo/client';
import { useEffect, useState } from 'react';

const Books = () => {
  const { loading, error, data } = useQuery(ALL_BOOKS);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [uniqueGenres, setUniqueGenres] = useState([]);

  useEffect(() => {
    if (data && data.allBooks) {
      const genresArr = data.allBooks.reduce(
        (genres, book) => (book.genres ? genres.concat(book.genres) : genres),
        []
      );

      const uniqueGenres = [...new Set(genresArr)];
      setUniqueGenres(uniqueGenres);
    }
  }, [data]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const books = selectedGenre
    ? data.allBooks.filter((book) => book.genres.includes(selectedGenre))
    : data.allBooks;

  return (
    <div>
      <p>Sort by genre: {selectedGenre ? selectedGenre : 'all genres'}</p>
      <div>
        {uniqueGenres.map((genre) => (
          <button key={genre} onClick={() => setSelectedGenre(genre)}>
            {genre}
          </button>
        ))}
        <button onClick={() => setSelectedGenre('')}>Show all books</button>
      </div>

      <h2>Books</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((book) => (
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
};

export default Books;
