import { useState, useEffect, useRef } from 'react';
import axios, { CancelToken } from 'axios';

interface Props {
  savedSongs: any[]
  setSavedSongs: any
}

const SearchBar: React.FC<Props> = ({ savedSongs, setSavedSongs }) => {
  const [results, setResults] = useState<any>([]);
  const [selectedSong, setSelectedSong] = useState<any>(null);
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
        } else {
          throw error;
        }
      }
    };

    if (query.length > 0) {
      source.current = axios.CancelToken.source();
      fetchData();
    } else {
      setResults([]);
    }
    return () => {
      source.current.cancel('Cancelling previous request');
    };
  }, [query]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const handleSongClick = (song: any) => {
    setSelectedSong(song);
    if (!savedSongs.find(savedSong => savedSong.id === song.id)) {
      setSavedSongs([...savedSongs, song]);
    }
    setResults(results.filter((result: any) => result.id !== song.id));
  };

  const handleSelectedSongClick = (song: any) => {
    setSavedSongs(savedSongs.filter(savedSong => savedSong.id !== song.id));
  };

  const handleClearClick = () => {
    setQuery('');
  }

  return (
    <div className="p-2 w-full md:w-1/3 relative">
      <input
        type="text"
        placeholder="Search Spotify"
        className="p-2 w-full border border-emerald-300 bg-gray-700 text-white rounded-t-md"
        value={query}
        onChange={handleInputChange}
      />
      {query.length > 0 && (
        <button className="absolute right-2 pt-3 pr-2" onClick={handleClearClick}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-300" viewBox="0 0 20 20" fill="gray">
            <path fillRule="evenodd" d="M14.293 14.293a1 1 0 0 1-1.414 0L10 11.414l-2.879 2.88a1 1 0 1 1-1.414-1.414L8.586 10l-2.88-2.879a1 1 0 1 1 1.414-1.414L10 8.586l2.879-2.88a1 1 0 1 1 1.414 1.414L11.414 10l2.879 2.879a1 1 0 0 1 0 1.414z" clipRule="evenodd" />
          </svg>
        </button>
      )}
      {results.length > 0 && (
        <ul className="list-none bg-black">
         {results.map((song: any) => (
           <li
             key={song.id}
             className="cursor-pointer p-2 text-emerald-300"
             onClick={() => handleSongClick(song)}
           >
            {song.artist ? 
            <p>{song.name} - {song.artist}</p> :
            <p>{song.name} - {song.artists[0].name}</p>
            }
           </li>
         ))}
        </ul>
      )}
      {savedSongs.length > 0 && (
        <ul className="list-none bg-emerald-300 rounded-b-md border border-emerald-300">
          {savedSongs.map((song: any) => (
            <li
              key={song.id}
              className="p-2 text-black"
              onClick={() => handleSelectedSongClick(song)}
            >
              {song.artist ? 
            <p>{song.name} - {song.artist}</p> :
            <p>{song.name} - {song.artists[0].name}</p>
            }
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
``
