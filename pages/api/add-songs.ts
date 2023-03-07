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
  const accessCode = req.body.accessCode
  const mustPlaySongs = spotifyToSongs(req.body.savedSongs, 1, accessCode);
  const doNotPlaySongs = spotifyToSongs(req.body.savedSongsRed, -1, accessCode);
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
