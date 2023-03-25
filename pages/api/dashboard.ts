import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from './dbconnect';
import Song, { Song as SongType } from './models/song';
import Party, { PartyType } from './models/party';

const allowedOrigins = [
  'www.untz.studio',
  'untz-vivid.vercel.app',
  'untz-vivid-adamziff.vercel.app',
];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Set up CORS
  const origin = req.headers.origin ? req.headers.origin : '';
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  try {
    await dbConnect();
    console.log('Connected to MongoDB Atlas');

    console.log(req.query)
    const { accessCode } = req.query;

    const songs: SongType[] = await Song.find({ party_ac: accessCode });
    const mustPlays = songs.filter((song) => song.play === 1).sort((a, b) => b.request_count - a.request_count);
    const doNotPlays = songs.filter((song) => song.play === -1).sort((a, b) => b.request_count - a.request_count);
    const requests = songs.filter((song) => song.play === 0).sort((a, b) => b.request_count - a.request_count);

    const party = await Party.findOne({ access_code: accessCode })

    res.status(200).json({mustPlays: mustPlays, requests: requests, doNotPlays: doNotPlays, name: party.name, duration: party.duration });

  } catch (error) {
    console.log(error);
    res.status(500).json({ songs: 'Unable to fetch songs.' });
  } 
  finally {
    console.log('Disconnected from MongoDB Atlas');
  }
}
