import { useState, useEffect, useRef } from 'react';
import axios, { CancelToken } from 'axios';
import { Song } from '../pages/api/models/song';

interface Props {
  savedSongsRed: any[]
  setSavedSongsRed: any
}

const SearchBarRed: React.FC<Props> = ({ savedSongsRed, setSavedSongsRed }) => {
  const [results, setResults] = useState<any>([]);
  const [selectedSong, setSelectedSong] = useState<any>(null);
  // const [savedSongs, setSavedSongs] = useState<any[]>([]);
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
          // console.log('Request cancelled', error.message);
        } else {
          throw error;
        }
      }
    };

    if (query.length > 0) {
      source.current = axios.CancelToken.source();
      fetchData();
    }
    else {
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
    if (!savedSongsRed.find(savedSong => savedSong.id === song.id)) {
      setSavedSongsRed([...savedSongsRed, song]);
    }
  };

  const handleSelectedSongClick = (song: any) => {
    setSavedSongsRed(savedSongsRed.filter(savedSong => savedSong.id !== song.id));
  };

  return (
    <div className="p-2 w-full md:w-1/3">
      <input
        type="text"
        placeholder="Search Spotify"
        className="p-2 w-full outline outline-red-400 rounded-md"
        value={query}
        onChange={handleInputChange}
      />
      {results.length > 0 && (
        <ul className="list-none bg-black">
         {results.map((song: any) => (
           <li
             key={song.id}
             className="cursor-pointer p-2 text-red-400"
             onClick={() => handleSongClick(song)}
           >
            {song.name} - {song.artists[0].name}
           </li>
         ))}
        </ul>
      )}
      {/* <h2 className="p-2 text-blue-300">Selected Songs</h2> */}
      {savedSongsRed.length > 0 && (
        <ul className="list-none bg-red-400 rounded-md">
          {savedSongsRed.map((song: any) => (
            <li key={song.id} 
                className="p-2 text-black"
                onClick={() => handleSelectedSongClick(song)}>
             {song.name}-{song.artists[0].name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBarRed;
``
