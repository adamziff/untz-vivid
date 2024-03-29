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

      // Find the Party in the database with a matching host code
      const party = await Party.findOne({ access_code: accessCode });

      if (!party) {
        res.status(404).json({ message: 'Party not found' });
        return;
      }

      // remove from mustPlays
      if (party.mustPlays.includes(spotifyId)) {
        party.mustPlays = party.mustPlays.filter((id: string) => id !== spotifyId);
      }

      // remove from doNotPlays
      if (party.doNotPlays.includes(spotifyId)) {
        party.doNotPlays = party.doNotPlays.filter((id: string) => id !== spotifyId);
      }

      // remove from requests
      if (party.requests.some((arr: string[]) => arr.includes(spotifyId))) {
        party.requests = party.requests.map((arr: string[]) => {
          const updatedArr = arr.filter((id: string) => id !== spotifyId);
          if (updatedArr.length > 0) {
            return updatedArr;
          }
          return null;
        }).filter((arr: string[] | null) => arr !== null) as string[][];
      }

      await party.save();

      // Find the Song in the database with both a matching spotify_id and party_ac
      const song = await Song.findOne({ spotify_id: spotifyId, party_ac: accessCode });

      if (!song) {
        res.status(404).json({ message: 'Song not found' });
        return;
      }

      // Remove the Song from the collection
      await Song.deleteOne({ _id: song._id });

      res.status(200).json({ message: 'Song removed successfully' });

      res.status(200).json({ message: 'Success' });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
