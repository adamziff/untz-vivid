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
  req.setTimeout(300000);
  console.log('req query')
  console.log(req.query)
  const partyId = req.query.partyId;
  // Set up CORS
  const origin = req.headers.origin ? req.headers.origin : '';
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  try {

    // first i need to get the party from the database that matches the partyId, and get the list of user uris from that
    await dbConnect();

    // Find the party with the given access code
    const party = await Party.findOne({ party_id: partyId });
    if (!party) {
      console.log('select-songs.tsx: party not found')
      res.status(404).json({ message: 'Party not found', data: '' });
      return;
      }
    else {
      console.log('party found')
    }

    const users = party.requests;
    console.log('requests')
    console.log(users)
    console.log(encodeURIComponent(JSON.stringify(users)))
    console.log('generating playlist')
    // const playlistResponse = await fetch(`http://localhost:8000/api/generate-playlist?users=${encodeURIComponent(JSON.stringify(requests))}`);
    const playlistResponse = await fetch(`https://untz-backend.azurewebsites.net/api/generate-playlist?users=${encodeURIComponent(JSON.stringify(users))}`);
    // const res = await axios.get(`/api/dashboard?partyId=${partyId}`);
    console.log('generate-playlist returned')
    if (playlistResponse.ok) {
        const playlist = await playlistResponse.json()
        console.log('generated playlist successfully')
        console.log(playlist)
        res.status(200).json({ message: 'python server accessed successfully', data: playlist });

      } else {
        // setSongs([]);
        const playlistError = await playlistResponse.json()
        console.log(playlistError)
        res.status(500).json({ message: 'playlist generation unsuccessful', data: playlistError })
        console.log("Failed to generate playlist")
      }

    // const response = await fetch('https://untz-backend.azurewebsites.net/api/data');
    // const data = await response.json();
    // // const { data } = await response.json();
    // console.log('returned data:');
    // console.log(data); // { data: 'Hello, World!' }

    // console.log('fetching songs from playlist with id' + playlistId);
    // res.status(200).json({ message: 'Songs selected successfully!', data });



  } catch (error) {
    console.log('unsuccessful');
    console.log(error);
    res.status(500).json({ message: 'Internal server error', data: error });

  } 

}

    
