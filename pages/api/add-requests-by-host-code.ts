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
  const { accessCode, savedSongs } = req.body;
  // console.log(accessCode);
  // console.log(savedSongs);

  // Set up CORS
  const origin = req.headers.origin ? req.headers.origin : '';
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  try {
    await dbConnect();

    // Find the party with the given guest code
    const party = await Party.findOne({ access_code: accessCode });

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

    // Add new songs to the song table with the right host code
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

    // add songs as requests, split into lists of five
    const sublistSize = 5;
    for (let i = 0; i < spotifyIds.length; i += sublistSize) {
        party.requests.push(spotifyIds.slice(i, i + sublistSize));
      }
    await party.save();

    

    // Send a success message
    res.status(200).json({ message: 'Songs added successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}


// import { NextApiRequest, NextApiResponse } from 'next';
// import dbConnect from './dbconnect';
// import Song, { spotifyToSongs } from './models/song';
// import Party from './models/party';

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   const { accessCode, savedSongs } = req.body;
//   console.log(accessCode)
// //   console.log(songs)
//   console.log(req.body)

//   try {
//     // Connect to MongoDB
//     await dbConnect();

//     // Convert the songs list to Song types
//     const songList = spotifyToSongs(savedSongs, 0, accessCode);

//     // Update or add each Song in the list to the collection
//     await Promise.all(
//       songList.map(async (song) => {
//         const existingSong = await Song.findOne({ party_ac: song.party_ac, spotify_id: song.spotify_id });

//         if (existingSong) {
//             existingSong.play = 0;
//             existingSong.request_count += 1;
//             await existingSong.save();
//           } else if (!existingSong) {
//           await Song.create(song);
//         }
//       })
//     );

//     // Find the Party in the parties collection with its access_code matching accessCode
//     const party = await Party.findOne({ access_code: accessCode });

//     // Add each Song uri in the songs list to the party.mustPlays list if it doesn't already exist
//     let newUriList: string[] = []
//     songList.forEach((song) => {
//       const requests: string[] = party.requests.flat();
//       if (!requests.includes(song.spotify_id)) {
//           newUriList.push(song.spotify_id)
//       }
//     });

//     // Remove each song uri from the party.doNotPlays list if it is found
//     songList.forEach((song) => {
//         const doNotPlayIndex = party.doNotPlays.indexOf(song.spotify_id);
//         if (doNotPlayIndex > -1) {
//             party.doNotPlays.splice(doNotPlayIndex, 1);
//         }
//         const mustPlayIndex = party.mustPlays.indexOf(song.spotify_id);
//         if (mustPlayIndex > -1) {
//             party.doNotPlays.splice(mustPlayIndex, 1);
//         }
//       });

//       // add songs as requests, split into lists of five
//     const sublistSize = 5;
//     for (let i = 0; i < newUriList.length; i += sublistSize) {
//         party.requests.push(newUriList.slice(i, i + sublistSize));
//       }

//     // Save the updated party to the database
//     await party.save();

//     res.status(200).json({ message: 'Success' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// }
