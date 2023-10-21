import { useEffect, useState } from 'react';
import { useMutation } from '@apollo/client';

import { EDIT_AUTHOR, ALL_AUTHORS } from '../queries';

const BornForm = ({ setError, authors }) => {
  const [name, setName] = useState('');
  const [bornTo, setBornTo] = useState('');

  const [changeDate, result] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
  });

  useEffect(() => {
    if (result.data && result.data.editAuthor === null) {
      setError('author not found');
    }
  }, [result.data]);

  const handleAuthorChange = (event) => {
    const selectedAuthor = event.target.value;
    setName(selectedAuthor);
  };

  const submit = async (event) => {
    event.preventDefault();

    const bornInt = parseInt(bornTo, 10);

    changeDate({ variables: { name, setBornTo: bornInt } });

    setName('');
    setBornTo('');
  };

  return (
    <div>
      <h2>Set birthyear</h2>

      <form onSubmit={submit}>
        <div>
          <select value={name} onChange={handleAuthorChange}>
            <option value="">Select an Author</option>
            {authors.map((author) => (
              <option key={author.name} value={author.name}>
                {author.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          born
          <input
            value={bornTo}
            onChange={({ target }) => setBornTo(target.value)}
          />
        </div>
        <button type="submit">update author</button>
      </form>
    </div>
  );
};

export default BornForm;
