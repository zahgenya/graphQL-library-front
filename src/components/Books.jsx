import { ALL_BOOKS } from "../queries"
import { useQuery } from "@apollo/client"

const Books = () => {
  const result = useQuery(ALL_BOOKS)
  const books = result.data ? result.data.allBooks : [];

  if (result.loading) {
    return <div>loading...</div>
  }

  if (result.error) {
    return <div>ERROR: {result.error.message}</div>
  }

  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((b) => (
            <tr key={b.title}>
              <td>{b.title}</td>
              <td>{b.author}</td>
              <td>{b.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Books