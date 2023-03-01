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
  console.log('req body')
  console.log(req.body)
  const partyId = req.body;
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
      res.status(404).json({ message: 'Party not found', data: '' });
      return;
      }

    console.log('party requests')
    console.log(party.requests)
    const requests = party.requests;
    console.log('encode stringify requests')
    console.log(encodeURIComponent(JSON.stringify(requests)))
    // then i need to send that list of uris as a parameter to the python endpoint
    // const playlistResponse = await fetch("https://untz-backend.azurewebsites.net/api/generate-playlist", {
    //     method: "GET",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify(requests),
    //   })
    const playlistResponse = await fetch(`https://untz-backend.azurewebsites.net/api/generate-playlist?users=${encodeURIComponent(JSON.stringify(requests))}`);
    // const res = await axios.get(`/api/dashboard?partyId=${partyId}`);
    console.log('generate playlist returned')
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

    
