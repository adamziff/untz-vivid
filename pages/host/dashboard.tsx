import { useState, useEffect } from 'react';
import axios from 'axios';
import { Song } from '../api/models/song';
import { useRouter } from 'next/router';
import { NextPage } from 'next';
import Layout from '../../components/Layout';
import Head from 'next/head';
import Link from 'next/link';

const Dashboard: NextPage = () => {
  const [songs, setSongs] = useState<Song[]>([]);
  const router = useRouter()
  const accessCode = router.query.accessCode as string;
  const inviteLink = router.query.inviteLink as string;
  const [isChanged, setIsChanged] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      alert('Invite link copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy invite link: ', err);
    }
  };

  useEffect(() => {
    if (!accessCode) return; // do not fetch if accessCode is not loaded
    const fetchData = async () => {
      setIsChanged(false);
      try {
        const res = await fetch(`/api/dashboard?accessCode=${accessCode}`)//, {
        if (res.ok) {
            const { songs } = await res.json()
            console.log('client songs')
            console.log(songs)
            setSongs(songs)
        } else {
            setSongs([]);
            console.log("Failed to get requested songs from db")
        }

      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [accessCode, isChanged]);

  const handleMustPlayClick = async (spotifyId: string) => {
    try {
      await axios.post(`/api/make-must-play/?spotifyId=${spotifyId}&accessCode=${accessCode}`);
      setSongs(prevSongs =>
        prevSongs.map(song =>
          song.spotify_id === spotifyId ? { ...song, must_play: true } : song
        )
      );
      setIsChanged(true);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDoNotPlayClick = async (spotifyId: string) => {
    try {
      await axios.post(`/api/make-do-not-play/?spotifyId=${spotifyId}&accessCode=${accessCode}`);
      setSongs(prevSongs =>
        prevSongs.map(song =>
          song.spotify_id === spotifyId ? { ...song, do_not_play: true } : song
        )
      );
      setIsChanged(true);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout>
        <Head>
            <title>üntz dashboard</title>
            <meta name="description" content="playlists for every party" />
            <link rel="icon" href="/favicon.ico" />
          </Head>
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-8 text-white">Party Dashboard</h1>

        <Link href={`/host/waiting?state=${accessCode}`}>
          <button className="bg-black text-blue-500 rounded-md px-3 py-1 font-bold">
              generate playlist!
          </button>
        </Link>
        <button
          className="text-emerald-300 p-3 text-center border border-emerald-300 rounded-md"
          onClick={copyToClipboard}
        >
          Copy Invite Link
        </button>

      {!songs || songs.length === 0 ? (
        <p>No songs found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {songs.map(song => (
            <div key={song.spotify_id} className="border border-emerald-300 p-6 rounded-lg shadow-md">
              <div className="text-xl text-white font-bold mb-4">{song.name}</div>
              <div className="text-gray-600 mb-4">{song.artist}</div>
              <div className="flex items-center mb-4">
                <div className="rounded-full bg-green-400 text-white px-2 py-1 text-sm mr-2">
                  {song.request_count}
                </div>
                <div className="text-gray-600">Requests</div>
              </div>
                <div className="flex justify-between">
                    <p className="text-sm text-gray-500">{song.request_count} Requests</p>
                    {song.play === 1 ? (
                    <div className="bg-emerald-300 text-black px-4 py-2 rounded-lg">
                        Must Play
                    </div>
                    ) : (
                    <button
                        onClick={() => handleMustPlayClick(song.spotify_id)}
                        className="border border-emerald-300 text-white px-4 py-2 rounded-lg"
                    >
                        Must Play
                    </button>
                    )}
                    {song.play === -1 ? (
                    <div className="bg-red-500 text-white px-4 py-2 rounded-lg">
                        Do Not Play
                    </div>
                    ) : (
                    <button
                        onClick={() => handleDoNotPlayClick(song.spotify_id)}
                        className="border border-red-500 text-red-500 px-4 py-2 rounded-lg"
                        >
                            Do Not Play
                        </button>
                    )}
                </div>
            </div>
          ))}
          </div>
      )}
    </div>
    </Layout>
  )
}

export default Dashboard
