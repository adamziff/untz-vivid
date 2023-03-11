import type { NextApiRequest, NextApiResponse } from 'next';
import Party, { PartyType } from './models/party';
import dbConnect from './dbconnect';
import { getSpotifyIds } from './models/song';

// change this datatype to an interface that matches the response from mongo
type Data = {
  message: string;
  accessCode: string;
  inviteLink: string;
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
  console.log(req.body)
  const { savedSongs, savedSongsRed, partyName, duration, bars, chaos } = req.body
  // const accessCode = '0'
  // const chaos = 20
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
        attendees: 0,
        requests: [getSpotifyIds(savedSongs)],
        mustPlays: getSpotifyIds(savedSongs),
        doNotPlays: getSpotifyIds(savedSongsRed)
    });

    await thisParty.save((err : any, savedParty: PartyType) => {
        if (err) {
          console.error(err);
          res.status(500).json({ message: 'Internal server error', accessCode: '', inviteLink: '' });
        } else {
          console.log('Party saved successfully!');
          res.status(200).json({
            message: 'Party added successfully!',
            accessCode: savedParty.access_code,
            inviteLink: savedParty.invite_link
          });
        }
      });

  } catch (error) {
    console.log(error);
  } 
//   finally {
//     console.log('Disconnected from MongoDB Atlas');
//   }
}

    
