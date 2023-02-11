import { useState, useEffect, useRef } from 'react';
import axios, { CancelToken } from 'axios';

const SearchBar: React.FC = () => {
  const [results, setResults] = useState<any>([]);
  const [selectedSong, setSelectedSong] = useState<any>(null);
  const [savedSongs, setSavedSongs] = useState<any>([]);
  const [query, setQuery] = useState<string>('');
  const source = useRef(axios.CancelToken.source());

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/api/search`, {
          cancelToken: source.current.token,
          params: {
            q: query
          }
        });

        setResults(response.data.tracks.items);
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log('Request cancelled', error.message);
        } else {
          throw error;
        }
      }
    };

    if (query.length > 0) {
      source.current.cancel();
      source.current = axios.CancelToken.source();
      fetchData();
    }
  }, [query]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const handleSongClick = (song: any) => {
    setSelectedSong(song);
    setSavedSongs([...savedSongs, song]);
  };

  return (
    <div className="p-4 bg-gray-200">
      <input
        type="text"
        placeholder="Search Spotify"
        className="p-2 w-full"
        value={query}
        onChange={handleInputChange}
      />
      {results.length > 0 && (
        <ul className="list-none">
          {results.map((song: any) => (
            <li
              key={song.id}
              className="cursor-pointer p-2 mb-2"
              onClick={() => handleSongClick(song)}
            >
              {song.name} - {song.artists[0].name}
            </li>
          ))}
        </ul>
      )}
      {selectedSong && (
        <div className="p-2 bg-green-200">
          {selectedSong.name} - {selectedSong.artists[0].name}
        </div>
      )}
      {savedSongs.length > 0 && (
        <ul className="list-none">
          {savedSongs.map((song: any) => (
            <li key={song.id} className="p-2 bg-green-200">
              {song.name} - {song.artists[0].name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
``