import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from './dbconnect';
import Song, { spotifyToSongs } from './models/song';
import Party from './models/party';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { accessCode, savedSongs } = req.body;
//   console.log(accessCode)
//   console.log(songs)
//   console.log(req.body)

  try {
    // Connect to MongoDB
    await dbConnect();

    // Convert the songs list to Song types
    const songList = spotifyToSongs(savedSongs, -1, accessCode);

    // Update or add each Song in the list to the collection
    await Promise.all(
      songList.map(async (song) => {
        const existingSong = await Song.findOne({ party_ac: song.party_ac, spotify_id: song.spotify_id });

        if (existingSong) {
            existingSong.play = -1;
            await existingSong.save();
          } else if (!existingSong) {
          await Song.create(song);
        }
      })
    );

    // Find the Party in the parties collection with its access_code matching accessCode
    const party = await Party.findOne({ access_code: accessCode });

    // Add each Song uri in the songs list to the party.doNotPlays list if it doesn't already exist
    songList.forEach((song) => {
      if (!party.doNotPlays.includes(song.spotify_id)) {
        party.doNotPlays.push(song.spotify_id);
      }
    });

    // Remove each song uri from the party.mustPlays list if it is found
    songList.forEach((song) => {
        const index = party.mustPlays.indexOf(song.spotify_id);
        if (index > -1) {
            party.mustPlays.splice(index, 1);
        }
      });

    // Save the updated party to the database
    await party.save();

    res.status(200).json({ message: 'Success' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
