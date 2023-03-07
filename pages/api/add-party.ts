import type { NextApiRequest, NextApiResponse } from 'next';
import Song, { songSchema } from './models/song';
import Party from './models/party';
import dbConnect from './dbconnect';
import mongoose from 'mongoose';
import { getSpotifyIds } from './models/song';

// change this datatype to an interface that matches the response from mongo
type Data = {
  message: string;
};


// const testParty = new Party({ 
//   name: 'Charter Friday', 
//   duration: 180, 
//   energy_curve: [0.3, 0.5, 0.8, 0.6], 
//   chaos: 0, 
//   date: new Date(), 
//   invite_link: '', 
//   attendees: 0, 
//   host_id: '', 
//   access_code: '0',
//   requests: [['7LP4Es66zdY7CyjepqmvAg', '27NovPIUIRrOZoCHxABJwK'], ['7LP4Es66zdY7CyjepqmvAg', '27NovPIUIRrOZoCHxABJwK'], ['6I9VzXrHxO9rA9A5euc8Ak', '2gam98EZKrF9XuOkU13ApN', '4omisSlTk6Dsq2iQD7MA07', '7xYnUQigPoIDAMPVK79NEq', '3uoQULcUWfnt6nc6J7Vgai']]
// });

const allowedOrigins = [
  'www.untz.studio',
  'untz-vivid.vercel.app',
  'untz-vivid-adamziff.vercel.app',
];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  console.log(req.body)
  const { savedSongs, savedSongsRed, partyName, duration, bars } = req.body
  const accessCode = '0'
  const chaos = 20
  // Set up CORS
  const origin = req.headers.origin ? req.headers.origin : '';
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  try {
    await dbConnect();
    console.log('Connected to MongoDB Atlas');

    const thisParty = new Party({
        name: partyName, 
        duration: duration, 
        energy_curve: bars.map((value: number) => value / 100), 
        chaos: chaos, 
        invite_link: 'https://untz.studio/guest/request-songs?accessCode=' + accessCode, 
        access_code: accessCode,
        requests: [getSpotifyIds(savedSongs)],
        mustPlays: getSpotifyIds(savedSongs),
        doNotPlays: getSpotifyIds(savedSongsRed)
    });

    await thisParty.save((err : any) => {
        if (err) {
          console.error(err);
          res.status(500).json({ message: 'Internal server error' });
        } else {
          console.log('Party saved successfully!');
          res.status(200).json({ message: 'Party added successfully!' });
        }
      });

  } catch (error) {
    console.log(error);
  } 
//   finally {
//     console.log('Disconnected from MongoDB Atlas');
//   }
}

    
