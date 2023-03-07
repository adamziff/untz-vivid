import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from './dbconnect';
import Song, { Song as SongType } from './models/song';

type Data = {
  data: string | SongType[];
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
  // Set up CORS
  const origin = req.headers.origin ? req.headers.origin : '';
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  try {
    await dbConnect();
    console.log('Connected to MongoDB Atlas');

    console.log(req.body)
    const { accessCode } = req.body;

    const songs: SongType[] = await Song.find({ access_code: accessCode });
    console.log('server songs')
    console.log(songs)
    res.status(200).json({data: songs});

  } catch (error) {
    console.log(error);
    res.status(500).json({ data: 'Unable to fetch songs.' });
  } 
  finally {
    console.log('Disconnected from MongoDB Atlas');
  }
}
