import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from './dbconnect';
import Song, { spotifyToSongs } from './models/song';
import Party from './models/party';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { accessCode, savedSongs } = req.body;
  console.log(accessCode)
//   console.log(songs)
  console.log(req.body)

  try {
    // Connect to MongoDB
    await dbConnect();

    // Convert the songs list to Song types
    const songList = spotifyToSongs(savedSongs, 0, accessCode);

    // Update or add each Song in the list to the collection
    await Promise.all(
      songList.map(async (song) => {
        const existingSong = await Song.findOne({ party_ac: song.party_ac, spotify_id: song.spotify_id });

        if (existingSong) {
            existingSong.play = 0;
            existingSong.request_count += 1;
            await existingSong.save();
          } else if (!existingSong) {
          await Song.create(song);
        }
      })
    );

    // Find the Party in the parties collection with its access_code matching accessCode
    const party = await Party.findOne({ access_code: accessCode });

    // Add each Song uri in the songs list to the party.mustPlays list if it doesn't already exist
    let newUriList: string[] = []
    songList.forEach((song) => {
      const requests: string[] = party.requests.flat();
      if (!requests.includes(song.spotify_id)) {
          newUriList.push(song.spotify_id)
      }
    });

    // Remove each song uri from the party.doNotPlays list if it is found
    songList.forEach((song) => {
        const doNotPlayIndex = party.doNotPlays.indexOf(song.spotify_id);
        if (doNotPlayIndex > -1) {
            party.doNotPlays.splice(doNotPlayIndex, 1);
        }
        const mustPlayIndex = party.mustPlays.indexOf(song.spotify_id);
        if (mustPlayIndex > -1) {
            party.doNotPlays.splice(mustPlayIndex, 1);
        }
      });

      // add songs as requests, split into lists of five
    const sublistSize = 5;
    for (let i = 0; i < newUriList.length; i += sublistSize) {
        party.requests.push(newUriList.slice(i, i + sublistSize));
      }

    // Save the updated party to the database
    await party.save();

    res.status(200).json({ message: 'Success' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
