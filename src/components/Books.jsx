import { ALL_BOOKS } from '../queries';
import { useQuery } from '@apollo/client';
import { useState } from 'react';

const Books = () => {
  const result = useQuery(ALL_BOOKS);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const books = result.data ? result.data.allBooks : [];

  if (result.loading) {
    return <div>loading...</div>;
  }

  if (result.error) {
    return <div>ERROR: {result.error.message}</div>;
  }

  const allBooks = result.data.allBooks;

  const genresArr = allBooks.reduce(
    (genres, book) =>
      book.genres ? genres.concat(book.genres) : genres,
    []
  );

  const uniqueGenres = [...new Set(genresArr)];

  const booksToShow = selectedGenre
    ? allBooks.filter((book) => book.genres.includes(selectedGenre))
    : allBooks;

    console.log('Unique Genres:', uniqueGenres);

  return (
    <div>
      <p>Sort by genre</p>
      <div>
        {uniqueGenres.map((genre) => (
          <button key={genre} onClick={() => setSelectedGenre(genre)}>
            {genre}
          </button>
        ))}
        <button onClick={() => setSelectedGenre(null)}>Show all books</button>
      </div>

      <h2>Books</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
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
};

export default Books;
