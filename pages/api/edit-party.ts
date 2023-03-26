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
  const { accessCode, partyName, duration, bars, chaos, } = req.body

  const sublistSize: number = 5;

  // Set up CORS
  const origin = req.headers.origin ? req.headers.origin : '';
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  try {
    await dbConnect();
    console.log('Connected to MongoDB Atlas');

    // find the Party with the specified accessCode
    const existingParty = await Party.findOne({ access_code: accessCode });

    // if no matching Party is found, return an error response
    if (!existingParty) {
      return res.status(404).json({
        message: 'Party not found',
        accessCode: '',
        inviteLink: ''
      });
    }

    // update the existing Party with the new values
    existingParty.name = partyName;
    existingParty.duration = duration;
    existingParty.energy_curve = bars.map((value: number) => value / 100);
    existingParty.chaos = chaos;

    await existingParty.save((err: any, updatedParty: PartyType) => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error', accessCode: '', inviteLink: '' });
      } else {
        console.log('Party updated successfully!');
        res.status(200).json({
          message: 'Party updated successfully!',
          accessCode: updatedParty.access_code,
          inviteLink: updatedParty.invite_link
        });
      }
    });
  } catch (error) {
    console.log(error);
  } 
}
