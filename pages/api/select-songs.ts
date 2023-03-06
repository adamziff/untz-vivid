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

    // first i need to get the party from the database that matches the accessCode, and get the list of user uris from that
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
    // console.log('requests')
    // console.log(users)
    // console.log(encodeURIComponent(JSON.stringify(users)))
    // const energyCurve = [0.3, 0.5, 0.9, 0.8, 0.7]
    const energyCurve = party.energy_curve;
    const chaos = party.chaos
    const numSongs = Math.round(party.duration/3) // assumes average 3 minutes / song
    // const mustPlays = party.mustPlays
    // const doNotPlays = party.doNotPlays
    console.log('generating playlist')
    const playlistResponse = await fetch(`https://untz-backend.azurewebsites.net/api/generate-playlist?users=${encodeURIComponent(JSON.stringify(users))}&energy_curve=${encodeURIComponent(JSON.stringify(energyCurve))}&chaos=${chaos}&num_songs_to_select=${numSongs}`);
    // const playlistResponse = await fetch(`http://localhost:8000/api/generate-playlist?users=${encodeURIComponent(JSON.stringify(users))}&energy_curve=${encodeURIComponent(JSON.stringify(energyCurve))}&chaos=${chaos}&num_songs_to_select=${numSongs}`);
    if (playlistResponse.ok) {
        const playlist = await playlistResponse.json()
        console.log('generated playlist successfully')
        console.log(playlist)
        console.log(playlist.tracks.length + ' songs')
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

    
