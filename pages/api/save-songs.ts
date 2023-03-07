// guests save songs - add to party object list of songs and add songs to song table (checking for duplicates)
import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from './dbconnect';
import Party from './models/party';
import Song, { spotifyToSongs } from './models/song';

const allowedOrigins = [
    'www.untz.studio',
    'untz-vivid.vercel.app',
    'untz-vivid-adamziff.vercel.app',
  ];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { guestCode, savedSongs } = req.body;
    console.log(guestCode)
    console.log(savedSongs)

    // Set up CORS
    const origin = req.headers.origin ? req.headers.origin : '';
    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    try {
        await dbConnect();

        // Find the party with the given guest code
        const party = await Party.findOne({ guest_code: guestCode });

        if (!party) {
        res.status(404).json({ error: 'Party not found' });
        return;
        }

        // console.log('savedSongs')
        // console.log(savedSongs)

        // Extract the Spotify IDs from the list of songs
        const spotifyIds = savedSongs.map((song: any) => song.uri);
        await party.save();

        // Append the Spotify IDs to the requests field of the party
        party.requests.push(spotifyIds);
        // Add songs to the song table with the right access code
        const allSongs = spotifyToSongs(savedSongs, 0, party.access_code)
        await Song.insertMany(allSongs)
        .then((result: any) => {
            console.log(result)
            // Send a success message
            res.status(200).json({ message: 'Songs added successfully!' });
        })
        .catch((error: any) => {
            console.log(error)
            res.status(500).json({ message: 'Internal server error' });
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
