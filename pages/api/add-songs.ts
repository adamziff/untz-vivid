import type { NextApiRequest, NextApiResponse } from 'next';
import Song, { songSchema } from './models/song';
import Party from './models/party';
import dbConnect from './dbconnect';
import mongoose from 'mongoose';
import { spotifyToSongs } from './models/song';

// change this datatype to an interface that matches the response from mongo
type Data = {
  message: string;
};

const testSong1 = new Song({
  name: 'Levels',
  artist: 'Avicii',
  duration: 4, // minutes (rounded)
  request_count: 5,
  play: 1,
  spotify_id: 'asdf',
  party_id: 'tyui',
});

const testSong2 = new Song({
  name: 'Animals',
  artist: 'Martin Garrix',
  duration: 3, // minutes (rounded)
  request_count: 2,
  play: 0,
  spotify_id: 'fdsa',
  party_id: 'ghkj',
});

const testSong3 = new Song({
  name: 'No Hands',
  artist: 'Waka Flocka Flame',
  duration: 5, // minutes (rounded)
  request_count: 7,
  play: -1,
  spotify_id: 'qwer',
  party_id: 'rewq',
});

const testParty = new Party({ 
  name: 'Charter Friday', 
  duration: 180, 
  energy_curve: [0.3, 0.5, 0.8, 0.6], 
  chaos: 0, 
  date: new Date(), 
  invite_link: '', 
  attendees: 0, 
  host_id: '', 
  access_code: '',
});

const testSongs = [testSong1, testSong2, testSong3]

const allowedOrigins = [
  'www.untz.studio',
  'untz-vivid.vercel.app',
  'untz-vivid-adamziff.vercel.app',
];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  // console.log(req.body.savedSongs)
  // console.log(req.body.savedSongsRed)
  const mustPlaySongs = spotifyToSongs(req.body.savedSongs, 1);
  const doNotPlaySongs = spotifyToSongs(req.body.savedSongsRed, -1);
  console.log(mustPlaySongs);
  console.log(doNotPlaySongs);
  // Set up CORS
  const origin = req.headers.origin ? req.headers.origin : '';
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  try {
    await dbConnect();
    console.log('Connected to MongoDB Atlas');

    const allSongs = mustPlaySongs.concat(doNotPlaySongs);
    await Song.insertMany(allSongs)
      .then((result) => {
        console.log(result)
        // Send a success message
        res.status(200).json({ message: 'Songs added successfully!' });
      })
      .catch((error) => {
        console.log(error)
        res.status(500).json({ message: 'Internal server error' });
      });

  } catch (error) {
    console.log(error);
  } 
  finally {
    console.log('Disconnected from MongoDB Atlas');
  }
}
