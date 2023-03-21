import type { NextApiRequest, NextApiResponse } from 'next';
import Party from './models/party';
import dbConnect from './dbconnect';

// change this datatype to an interface that matches the response from mongo
type Data = {
  message: string;
  data: any;
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
//   console.log(req.query)
  const { guestCode } = req.query
//   console.log(accessCode)
  // Set up CORS
  const origin = req.headers.origin ? req.headers.origin : '';
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  try {
    await dbConnect();
    console.log('Connected to MongoDB Atlas');

    // Find the party with the given access code
    const party = await Party.findOne({ guest_code: guestCode });
    if (!party) {
        console.log('get-party.tsx: party not found')
        res.status(500).json({ message: 'Internal server error', data: {} });
        return;
    }
    else {
        res.status(200).json({ message: 'Party found!', data: party });
        console.log('party found')
        return;
    }

  } catch (error) {
    console.log(error);
    console.log('get-party.tsx: error finding party')
    res.status(500).json({ message: 'Internal server error', data: {} });
    return;
  } 
//   finally {
//     console.log('Disconnected from MongoDB Atlas');
//   }
}

    
