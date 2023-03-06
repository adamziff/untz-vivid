import type { NextApiRequest, NextApiResponse } from 'next';
import Party from './models/party';
import dbConnect from './dbconnect';

type Data = {
  message: string;
  data: any
};

const allowedOrigins = [
  'www.untz.studio',
  'untz-vivid.vercel.app',
  'untz-vivid-adamziff.vercel.app',
];

// const playlistId = 0

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  console.log('req query')
  console.log(req.query)
  const accessCode = req.query.accessCode;
  // Set up CORS
  const origin = req.headers.origin ? req.headers.origin : '';
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  try {
    await dbConnect();

    // Find the party with the given access code
    const party = await Party.findOne({ party_ac: accessCode });
    if (!party) {
      console.log('select-songs.tsx: party not found')
      res.status(404).json({ message: 'Party not found', data: '' });
      return;
      }
    else {
      console.log('party found')
    }

    const users = party.requests;
    const energyCurve = party.energy_curve;
    const chaos = party.chaos
    const numSongs = Math.round(party.duration/3) // assumes average 3 minutes / song

    console.log('generating playlist')
    const fetchOptions: Partial<RequestInit> & { timeout: number } = {
      timeout: 300000,
    };
    const playlistResponse = await fetch(
      `https://untz-backend.azurewebsites.net/api/generate-playlist?users=${encodeURIComponent(
        JSON.stringify(users)
      )}&energy_curve=${encodeURIComponent(
        JSON.stringify(energyCurve)
      )}&chaos=${chaos}&num_songs_to_select=${numSongs}`,
      fetchOptions
    );
    // const playlistResponse = await fetch(`http://localhost:8000/api/generate-playlist?users=${encodeURIComponent(JSON.stringify(users))}&energy_curve=${encodeURIComponent(JSON.stringify(energyCurve))}&chaos=${chaos}&num_songs_to_select=${numSongs}`);
    if (playlistResponse.ok) {
        const playlist = await playlistResponse.json()
        console.log('generated playlist successfully')
        console.log(playlist)
        console.log(playlist.tracks.length + ' songs')
        res.status(200).json({ message: 'python server accessed successfully', data: playlist });

      } else {
        const playlistError = await playlistResponse.json()
        console.log(playlistError)
        res.status(500).json({ message: 'playlist generation unsuccessful', data: playlistError })
        console.log("Failed to generate playlist")
      }

  } catch (error) {
    console.log('unsuccessful');
    console.log(error);
    res.status(500).json({ message: 'Internal server error', data: error });

  } 

}

    
