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
  console.log(guestCode);
  console.log(savedSongs);

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

    // Extract the Spotify IDs from the list of songs
    const spotifyIds = savedSongs.map((song: any) => song.uri);

    // Find existing songs by spotify_id and party_ac
    const existingSongs = await Song.find({
      spotify_id: { $in: spotifyIds },
      party_ac: party.access_code,
    });

    // Add new songs to the song table with the right access code
    const newSongs = spotifyToSongs(
      savedSongs.filter(
        (song: any) => !existingSongs.some((s: any) => s.spotify_id === song.uri)
      ),
      0,
      party.access_code
    );
    await Song.insertMany(newSongs);

    // Update request_count of existing songs
    for (const existingSong of existingSongs) {
      savedSongs.find((song: any) => song.uri === existingSong.spotify_id);
      existingSong.request_count += 1;
      await existingSong.save();
    }

    // Append the Spotify IDs to the requests field of the party
    party.requests.push(spotifyIds);
    await party.save();

    

    // Send a success message
    res.status(200).json({ message: 'Songs added successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
