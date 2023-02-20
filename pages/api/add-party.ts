import type { NextApiRequest, NextApiResponse } from 'next';
import Song, { songSchema } from './models/song';
import Party from './models/party';
import dbConnect from './dbconnect';
import mongoose from 'mongoose';

// change this datatype to an interface that matches the response from mongo
type Data = {
  message: string;
};


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

const allowedOrigins = [
  'www.untz.studio',
  'untz-vivid.vercel.app',
  'untz-vivid-adamziff.vercel.app',
];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  console.log(req.body.bars)
  // Set up CORS
  const origin = req.headers.origin ? req.headers.origin : '';
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  try {
    await dbConnect();
    console.log('Connected to MongoDB Atlas');

    await testParty.save((err : any) => {
        if (err) {
          console.error(err);
          res.status(500).json({ message: 'Internal server error' });
        } else {
          console.log('Party saved successfully!');
          res.status(200).json({ message: 'Songs added successfully!' });
        }
      });

  } catch (error) {
    console.log(error);
  } 
//   finally {
//     console.log('Disconnected from MongoDB Atlas');
//   }
}

    
