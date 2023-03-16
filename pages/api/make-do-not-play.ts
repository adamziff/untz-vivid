import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from './dbconnect';
import Song from './models/song';
import Party from './models/party';

type RequestData = {
  accessCode: string;
  spotifyId: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { spotifyId, accessCode } = req.query as RequestData;

    try {
      await dbConnect();

      // Find the Party in the database with a matching access code
      const party = await Party.findOne({ access_code: accessCode });

      if (!party) {
        res.status(404).json({ message: 'Party not found' });
        return;
      }

      // Check if the Party's doNotPlays list of strings contains spotifyId - if not, add spotifyId to doNotPlays
      if (!party.doNotPlays.includes(spotifyId)) {
        party.doNotPlays.push(spotifyId);
      }

      // Also check if the Party's mustPlays list contains spotifyId - if so, remove spotifyId from mustPlays
      if (party.mustPlays.includes(spotifyId)) {
        party.mustPlays = party.mustPlays.filter((id: string) => id !== spotifyId);
      }

      await party.save();

      // Find the Song in the database with both a matching spotify_id and party_ac
      const song = await Song.findOne({ spotify_id: spotifyId, party_ac: accessCode });
      console.log(song)

      if (!song) {
        res.status(404).json({ message: 'Song not found' });
        return;
      }

      // Set the Song's play value to 1
      song.play = -1;
      await song.save();

      res.status(200).json({ message: 'Success' });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
