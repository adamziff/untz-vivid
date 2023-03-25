import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Song } from '../api/models/song';
import { useRouter } from 'next/router';
import { NextPage } from 'next';
import Layout from '../../components/Layout';
import Head from 'next/head';
import Link from 'next/link';

const Dashboard: NextPage = () => {
  const [mustPlays, setMustPlays] = useState<Song[]>([]);
  const [requests, setRequests] = useState<Song[]>([]);
  const [doNotPlays, setDoNotPlays] = useState<Song[]>([]);
  const router = useRouter()
  const accessCode = router.query.accessCode as string;
  const inviteLink = router.query.inviteLink as string;
  const [isChanged, setIsChanged] = useState(false);
  const [showAllMustPlays, setShowAllMustPlays] = useState(false)
  const [showAllRequests, setShowAllRequests] = useState(false)
  const [showAllDoNotPlays, setShowAllDoNotPlays] = useState(false)
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [name, setPartyName] = useState<string | null>(null);
  const [duration, setPartyDuration] = useState<number | null>(null);

  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleDocumentMouseUp = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuId(null);
      }
    };
  
    document.addEventListener('mouseup', handleDocumentMouseUp);
    return () => {
      document.removeEventListener('mouseup', handleDocumentMouseUp);
    };
  }, [menuRef]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      alert('Invite link copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy invite link: ', err);
    }
  };

  const copyToAccessCodeClipboard = async () => {
    try {
      await navigator.clipboard.writeText(accessCode);
      alert('Host code copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy host code: ', err);
    }
  };

  useEffect(() => {
    if (!accessCode) return; // do not fetch if accessCode is not loaded
    const fetchData = async () => {
      setIsChanged(false);
      try {
        const res = await fetch(`/api/dashboard?accessCode=${accessCode}`)//, {
        if (res.ok) {
            const { mustPlays, requests, doNotPlays, name, duration } = await res.json()
            setMustPlays(mustPlays)
            setRequests(requests)
            setDoNotPlays(doNotPlays)
            setPartyName(name)
            setPartyDuration(duration)
        } else {
            setMustPlays([])
            setRequests([])
            setDoNotPlays([])
            console.log("Failed to get requested songs from db")
        }

      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [accessCode, isChanged]);

  const handleMustPlayClick = async (spotifyId: string) => {
    setOpenMenuId(null);
    try {
      await axios.post(`/api/make-must-play/?spotifyId=${spotifyId}&accessCode=${accessCode}`);
      setIsChanged(true);
    } catch (error) {
      console.log(error);
    }
  };

  const handleRemoveMustPlayClick = async (spotifyId: string) => {
    setOpenMenuId(null);
    try {
      await axios.post(`/api/remove-must-play/?spotifyId=${spotifyId}&accessCode=${accessCode}`);
      setIsChanged(true);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDoNotPlayClick = async (spotifyId: string) => {
    setOpenMenuId(null);
    try {
      await axios.post(`/api/make-do-not-play/?spotifyId=${spotifyId}&accessCode=${accessCode}`);
      setIsChanged(true);
    } catch (error) {
      console.log(error);
    }
  };
  const handleRemoveDoNotPlayClick = async (spotifyId: string) => {
    setOpenMenuId(null);
    try {
      await axios.post(`/api/remove-do-not-play/?spotifyId=${spotifyId}&accessCode=${accessCode}`);
      setIsChanged(true);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteSongClick = async (spotifyId: string) => {
    setOpenMenuId(null);
    try {
      await axios.post(`/api/delete-song/?spotifyId=${spotifyId}&accessCode=${accessCode}`);
      setIsChanged(true);
    } catch (error) {
      console.log(error);
    }
  };

  const handleGeneratePlaylistClick = async () => {
    setOpenMenuId(null)
    try {
      if (duration && mustPlays.length * 3 > duration) {
        alert('your duration is too small! either remove some must plays or increase your duration.')
        return;
    } else {
        router.push(`/host/waiting?state=${accessCode}`)
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Layout>
        <Head>
            <title>üntz dashboard</title>
            <meta name="description" content="playlists for every party" />
            <link rel="icon" href="/favicon.ico" />
          </Head>

        {name ? 
          <h1 className="basis-full text-4xl font-bold mb-8 text-white">
            Dashboard - {name}
          </h1> : 
          <h1 className="basis-full text-4xl font-bold mb-8 text-white">
            Loading Dashboard Data...
          </h1> 
        }

      <div className="w-full flex flex-col md:flex-row justify-center md:justify-start items-center text-center">
        <button
          className="text-white p-3 text-center border-2 border border-white rounded-md w-44 md:ml-2"
          onClick={copyToClipboard}
        >
          Copy Invite Link
        </button>
        <div className="md:px-4 py-2"></div>
        <button
          className="text-emerald-300 p-3 text-center border-2 border border-emerald-300 rounded-md w-44 md:ml-2"
          onClick={copyToAccessCodeClipboard}
        >
          Copy Host Code
        </button>
        <div className="md:px-4 py-2"></div>
        <button onClick={handleGeneratePlaylistClick} className="bg-gradient-to-r to-red-500 from-blue-500 text-white rounded-md p-3 md:mr-2 w-44">
          Generate Playlist!
        </button>
      </div>


        {/* Must Plays Section */}
        <div className="bg-black shadow rounded-lg p-4 relative">
          <h2 className="text-2xl font-bold mb-2 text-emerald-300 inline-block">must plays ({mustPlays.length})</h2>
          <Link href={`/host/add-must-plays?accessCode=${accessCode}&inviteLink=${inviteLink}`}>
            <button className="md:absolute top-1 md:right-0 mb-2 md:mt-2 mr-2 bg-black border border-emerald-300 text-white py-2 px-4 rounded" type="button">
              Add Must Play
            </button>
          </Link>
        <ul className="space-y-2">
        {mustPlays.slice(0, 3).map((song) => {
            const isOpen = song.spotify_id === openMenuId;

            const handleEllipsisClick = (event: React.MouseEvent<HTMLButtonElement>) => {
              event.stopPropagation();
              setOpenMenuId(song.spotify_id);
            };

            return (
              <li
                key={song.spotify_id}
                className="flex justify-between items-center border-b border-gray-300 pb-2"
              >
                <div>
                  <h3 className="font-bold text-white">{song.name}</h3>
                  <p className="text-gray-500">
                    {song.artist} &mdash;{' '}
                    <span className="font-semibold">{song.request_count} requests</span>
                  </p>
                </div>
                <div>
                  <button
                    className="text-gray-400 hover:text-gray-700"
                    onClick={handleEllipsisClick}
                  >
                    ...
                  </button>
                  <div
                    ref={menuRef}
                    className={`absolute right-0 w-48 py-2 border rounded-lg shadow-xl bg-black z-50 ${
                      isOpen ? '' : 'hidden'
                    }`}
                  >
                    <button
                      className="block w-full text-left px-4 py-2 text-sm text-transparent bg-clip-text bg-gradient-to-r to-red-500 from-blue-500"
                      onClick={() => handleRemoveMustPlayClick(song.spotify_id)}
                    >
                      Move to Requests
                    </button>
                    <button
                      className="block w-full text-left px-4 py-2 text-sm text-red-400"
                      onClick={() => handleDoNotPlayClick(song.spotify_id)}
                    >
                      Move to Do Not Plays
                    </button>
                    <button
                      className="block w-full text-left px-4 py-2 text-sm text-white"
                      onClick={() => handleDeleteSongClick(song.spotify_id)}
                    >
                      Delete song
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
          {mustPlays.length > 3 && !showAllMustPlays && (
            <li className="text-center">
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setShowAllMustPlays(true)}
              >
                Show All
              </button>
            </li>
          )}
        </ul>
        <ul className="space-y-2 pt-2">
          {showAllMustPlays &&
            mustPlays.slice(3).map((song) => {
              const isOpen = song.spotify_id === openMenuId;

            const handleEllipsisClick = (event: React.MouseEvent<HTMLButtonElement>) => {
              event.stopPropagation();
              setOpenMenuId(song.spotify_id);
            };

            return (
              <li
                key={song.spotify_id}
                className="flex justify-between items-center border-b border-gray-300 pb-2"
              >
                <div>
                  <h3 className="font-bold text-white">{song.name}</h3>
                  <p className="text-gray-500">
                    {song.artist} &mdash;{' '}
                    <span className="font-semibold">{song.request_count} requests</span>
                  </p>
                </div>
                <div>
                  <button
                    className="text-gray-400 hover:text-gray-700"
                    onClick={handleEllipsisClick}
                  >
                    ...
                  </button>
                  <div
                    ref={menuRef}
                    className={`absolute right-0 w-48 py-2 bg-black border rounded-lg shadow-xl z-50 ${
                      isOpen ? '' : 'hidden'
                    }`}
                  >
                    <button
                      className="block w-full text-left px-4 py-2 text-sm text-transparent bg-clip-text bg-gradient-to-r to-red-500 from-blue-500"
                      onClick={() => handleRemoveMustPlayClick(song.spotify_id)}
                    >
                      Move to Requests
                    </button>
                    <button
                      className="block w-full text-left px-4 py-2 text-sm text-red-400"
                      onClick={() => handleDoNotPlayClick(song.spotify_id)}
                    >
                      Move to Do Not Plays
                    </button>
                    <button
                      className="block w-full text-left px-4 py-2 text-sm text-white"
                      onClick={() => handleDeleteSongClick(song.spotify_id)}
                    >
                      Delete song
                    </button>
                  </div>
                </div>
              </li>
            );
            })}
            {showAllMustPlays && (
            <li className="text-center">
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setShowAllMustPlays(false)}
              >
                Show Less
              </button>
            </li>
          )}
          </ul>
        </div>

        {/* Requests Section */}
      <div className="bg-black shadow rounded-lg p-4 relative">
        <h2 className="text-2xl mb-2 py-3 font-bold text-transparent bg-clip-text bg-gradient-to-r to-red-500 from-blue-500 w-44 inline-block">
          requests ({requests.length})
        </h2>
        <div className="md:absolute right-0 mb-2 md:mt-2 mr-2 rounded bg-gradient-to-r from-blue-500 to-red-500 p-0.5 top-4 w-max">
          <Link href={`/host/add-requests?accessCode=${accessCode}&inviteLink=${inviteLink}`}>
            <button className="bg-black text-white py-2 px-4 rounded" type="button">
              Add Requests
            </button>
          </Link>
        </div>
        <ul className="space-y-2">
        {requests.slice(0, 3).map((song) => {
            const isOpen = song.spotify_id === openMenuId;

            const handleEllipsisClick = (event: React.MouseEvent<HTMLButtonElement>) => {
              event.stopPropagation();
              setOpenMenuId(song.spotify_id);
            };

            return (
              <li
                key={song.spotify_id}
                className="flex justify-between items-center border-b border-gray-300 pb-2"
              >
                <div>
                  <h3 className="font-bold text-white">{song.name}</h3>
                  <p className="text-gray-500">
                    {song.artist} &mdash;{' '}
                    <span className="font-semibold">{song.request_count} requests</span>
                  </p>
                </div>
                <div>
                  <button
                    className="text-gray-400 hover:text-gray-700"
                    onClick={handleEllipsisClick}
                  >
                    ...
                  </button>
                  <div
                    ref={menuRef}
                    className={`absolute right-0 w-48 py-2 border rounded-lg shadow-xl bg-black z-50 ${
                      isOpen ? '' : 'hidden'
                    }`}
                  >
                    <button
                      className="block w-full text-left px-4 py-2 text-sm text-emerald-300"
                      onClick={() => handleMustPlayClick(song.spotify_id)}
                    >
                      Move to Must Plays
                    </button>
                    <button
                      className="block w-full text-left px-4 py-2 text-sm text-red-400"
                      onClick={() => handleDoNotPlayClick(song.spotify_id)}
                    >
                      Move to Do Not Plays
                    </button>
                    <button
                      className="block w-full text-left px-4 py-2 text-sm text-white"
                      onClick={() => handleDeleteSongClick(song.spotify_id)}
                    >
                      Delete song
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
          {requests.length > 3 && !showAllRequests && (
            <li className="text-center">
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setShowAllRequests(true)}
              >
                Show All
              </button>
            </li>
          )}
        </ul>
        <ul className="space-y-2 pt-2">
          {showAllRequests &&
            requests.slice(3).map((song) => {
              const isOpen = song.spotify_id === openMenuId;

            const handleEllipsisClick = (event: React.MouseEvent<HTMLButtonElement>) => {
              event.stopPropagation();
              setOpenMenuId(song.spotify_id);
            };

            return (
              <li
                key={song.spotify_id}
                className="flex justify-between items-center border-b border-gray-300 pb-2"
              >
                <div>
                  <h3 className="font-bold text-white">{song.name}</h3>
                  <p className="text-gray-500">
                    {song.artist} &mdash;{' '}
                    <span className="font-semibold">{song.request_count} requests</span>
                  </p>
                </div>
                <div>
                  <button
                    className="text-gray-400 hover:text-gray-700"
                    onClick={handleEllipsisClick}
                  >
                    ...
                  </button>
                  <div
                    ref={menuRef}
                    className={`absolute right-0 w-48 py-2 bg-black border rounded-lg shadow-xl z-50 ${
                      isOpen ? '' : 'hidden'
                    }`}
                  >
                    <button
                      className="block w-full text-left px-4 py-2 text-sm text-emerald-300"
                      onClick={() => handleMustPlayClick(song.spotify_id)}
                    >
                      Move to Must Plays
                    </button>
                    <button
                      className="block w-full text-left px-4 py-2 text-sm text-red-400"
                      onClick={() => handleDoNotPlayClick(song.spotify_id)}
                    >
                      Move to Do Not Plays
                    </button>
                    <button
                      className="block w-full text-left px-4 py-2 text-sm text-white"
                      onClick={() => handleDeleteSongClick(song.spotify_id)}
                    >
                      Delete song
                    </button>
                  </div>
                </div>
              </li>
            );
            })}
            {showAllRequests && (
            <li className="text-center">
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setShowAllRequests(false)}
              >
                Show Less
              </button>
            </li>
          )}
          </ul>
        </div>
        
        {/* Do Not Plays Section */}
      <div className="bg-black shadow rounded-lg p-4 relative">
        <h2 className="text-2xl font-bold mb-2 text-red-400 inline-block">do not plays ({doNotPlays.length})</h2>
        <Link href={`/host/add-do-not-plays?accessCode=${accessCode}&inviteLink=${inviteLink}`}>
            <button className="md:absolute top-1 md:right-0 mb-2 md:mt-2 mr-2 bg-black border border-red-400 text-white py-2 px-4 rounded" type="button">
              Add Do Not Play
            </button>
          </Link>
        <ul className="space-y-2">
        {doNotPlays.slice(0, 3).map((song) => {
            const isOpen = song.spotify_id === openMenuId;

            const handleEllipsisClick = (event: React.MouseEvent<HTMLButtonElement>) => {
              event.stopPropagation();
              setOpenMenuId(song.spotify_id);
            };

            return (
              <li
                key={song.spotify_id}
                className="flex justify-between items-center border-b border-gray-300 pb-2"
              >
                <div>
                  <h3 className="font-bold text-white">{song.name}</h3>
                  <p className="text-gray-500">
                    {song.artist} &mdash;{' '}
                    <span className="font-semibold">{song.request_count} requests</span>
                  </p>
                </div>
                <div>
                  <button
                    className="text-gray-400 hover:text-gray-700"
                    onClick={handleEllipsisClick}
                  >
                    ...
                  </button>
                  <div
                    ref={menuRef}
                    className={`absolute right-0 w-48 py-2 border rounded-lg shadow-xl bg-black z-50 ${
                      isOpen ? '' : 'hidden'
                    }`}
                  >
                    <button
                      className="block w-full text-left px-4 py-2 text-sm text-emerald-300"
                      onClick={() => handleMustPlayClick(song.spotify_id)}
                    >
                      Move to Must Plays
                    </button>
                    <button
                      className="block w-full text-left px-4 py-2 text-sm text-transparent bg-clip-text bg-gradient-to-r to-red-500 from-blue-500"
                      onClick={() => handleRemoveDoNotPlayClick(song.spotify_id)}
                    >
                      Move to Requests
                    </button>
                    <button
                      className="block w-full text-left px-4 py-2 text-sm text-white"
                      onClick={() => handleDeleteSongClick(song.spotify_id)}
                    >
                      Delete song
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
          {doNotPlays.length > 3 && !showAllDoNotPlays && (
            <li className="text-center">
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setShowAllDoNotPlays(true)}
              >
                Show All
              </button>
            </li>
          )}
        </ul>
        <ul className="space-y-2 pt-2">
          {showAllDoNotPlays &&
            doNotPlays.slice(3).map((song) => {
              const isOpen = song.spotify_id === openMenuId;

            const handleEllipsisClick = (event: React.MouseEvent<HTMLButtonElement>) => {
              event.stopPropagation();
              setOpenMenuId(song.spotify_id);
            };

            return (
              <li
                key={song.spotify_id}
                className="flex justify-between items-center border-b border-gray-300 pb-2"
              >
                <div>
                  <h3 className="font-bold text-white">{song.name}</h3>
                  <p className="text-gray-500">
                    {song.artist} &mdash;{' '}
                    <span className="font-semibold">{song.request_count} requests</span>
                  </p>
                </div>
                <div>
                  <button
                    className="text-gray-400 hover:text-gray-700"
                    onClick={handleEllipsisClick}
                  >
                    ...
                  </button>
                  <div
                    ref={menuRef}
                    className={`absolute right-0 w-48 py-2 bg-black border rounded-lg shadow-xl z-50 ${
                      isOpen ? '' : 'hidden'
                    }`}
                  >
                    <button
                      className="block w-full text-left px-4 py-2 text-sm text-emerald-300"
                      onClick={() => handleMustPlayClick(song.spotify_id)}
                    >
                      Move to Must Plays
                    </button>
                    <button
                      className="block w-full text-left px-4 py-2 text-sm text-transparent bg-clip-text bg-gradient-to-r to-red-500 from-blue-500"
                      onClick={() => handleRemoveDoNotPlayClick(song.spotify_id)}
                    >
                      Move to Requests
                    </button>
                    <button
                      className="block w-full text-left px-4 py-2 text-sm text-white"
                      onClick={() => handleDeleteSongClick(song.spotify_id)}
                    >
                      Delete song
                    </button>
                  </div>
                </div>
              </li>
            );
            })}
            {showAllDoNotPlays && (
            <li className="text-center">
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setShowAllDoNotPlays(false)}
              >
                Show Less
              </button>
            </li>
          )}
          </ul>
        </div>
    </Layout>
  )
}

export default Dashboard
