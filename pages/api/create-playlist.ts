import type { NextApiRequest, NextApiResponse } from 'next';
// import { loadEnvConfig } from '@next/env';
import dbConnect from './dbconnect';
import Party from './models/party';

var SpotifyWebApi = require('spotify-web-api-node');

// const env = loadEnvConfig(process.cwd());

const clientId = 'f5e1c0e33ba2435ca10ef8beb593984d';
const clientSecret = process.env.CLIENT_SECRET;
// const redirectUri = 'http://localhost:3000/host/waiting'
const redirectUri = 'https://www.untz.studio/host/waiting'

// Setting credentials can be done in the wrapper's constructor, or using the API object's setters.
var spotifyApi = new SpotifyWebApi({
    redirectUri: redirectUri,
    clientId: clientId,
    clientSecret: clientSecret
});

type Data = {
  data: string;
};

const allowedOrigins = [
  'www.untz.studio',
  'untz-vivid.vercel.app',
  'untz-vivid-adamziff.vercel.app',
];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
    // Set up CORS
    const origin = req.headers.origin ? req.headers.origin : '';
    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }

    console.log('create-playlist.ts: req.query')
    console.log('typeof req.query.songs')
    console.log(typeof req.query.songs)
    console.log(req.query.songs)
    const songs = req.query.songs ? JSON.parse(req.query.songs as string) as string[] : [];
    console.log('typeof songs after JSON.parse')
    console.log(typeof songs)
    console.log(songs)
    const authCode = req.query.code
    const accessCode = req.query.accessCode
    // console.log('authCode')
    // console.log(authCode)
    // console.log('songs')
    // console.log(songs)
    // console.log(songs?.length)

    try {
        await dbConnect();
        console.log('Connected to MongoDB Atlas');
    
        const party = await Party.findOne({accessCode: accessCode});
        if (!party || party.name === null) {
            res.status(404).json({ data: 'Internal server error: party not found' });
            return
        }
        const partyName = party.name;
        console.log(partyName)

        // Retrieve an access token and a refresh token
        console.log('create-playlist.ts: starting authcodegrant')

        const { body: { access_token, refresh_token } } = await spotifyApi.authorizationCodeGrant(authCode);
        spotifyApi.setAccessToken(access_token);
        spotifyApi.setRefreshToken(refresh_token);

        const { body: { id: playlistId } } = await spotifyApi.createPlaylist(partyName, { 'description': 'created with üntz.studio', 'public': true });
        console.log('Created playlist!', playlistId);

        // const addResponse = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
        //     method: "POST",
        //     headers: {
        //       "Authorization": `Bearer ${access_token}`,
        //       "Content-Type": "application/json"
        //     },
        //     body: JSON.stringify({ uris: songs })
        //   });

        // const addResponseData = await addResponse.json()

        const { body: snapshot_id } = await spotifyApi.addTracksToPlaylist(playlistId, songs);
        // const { body: snapshot_id } = await spotifyApi.addTracksToPlaylist(playlistId, ["spotify:track:6rlQYRWG6ZN5X89LA0zBE7","spotify:track:1epmKmAPTKRm0M8wLOvRSx","spotify:track:1Xg9k7OAyJryBXVx3KUklz","spotify:track:1E8i4Xq9tH2LVWC0b1Sptj","spotify:track:7GOVV7GTEAvrLaUalM7Qol","spotify:track:5gSBWSvdTJ6rxoRIjZSNMP","spotify:track:1hfgPhddFIYnGhhrJlz9AN","spotify:track:3GEmPTpDTiPWyeHQVmYeMg","spotify:track:0ne1RwBCqJ5zyO6pjqwwp6","spotify:track:6PUo33nojdU5hWhMR0zRuf","spotify:track:22t8PQeP5klRoguomM4wZp","spotify:track:3FSOP0KUsO3hv96E92CHsp","spotify:track:1FhmdSGBoEqFLW16PlZOiZ","spotify:track:6CXHTCR4vfCzMZlXZUiw1u","spotify:track:7uvxkcv7FWVh4wE91I8Bi2","spotify:track:5aNjxmDikP3zGMHfO9dop5","spotify:track:1bmvJkAA8Yz9bv6y3WOj3U","spotify:track:1qCHidBbWAgv3pn6UbZ4Lg","spotify:track:3pOc5B57GjvEGeQwcLoBAB","spotify:track:4X9x9nwgdxy4npPV0JUa7G","spotify:track:7DBdjkgNcnTUrRfKsZaSny","spotify:track:2NGPPfcQfNm3f2ym3WHBuf","spotify:track:7m7o9XPUS54mSY0g5DjNu1","spotify:track:1Dy0DNtetR2wtHTk006nO2","spotify:track:5klJoVyUPQyqgG8TpVekRo","spotify:track:4e64oQwdgwUUADrC26DCdI","spotify:track:6LnYWfQ1amSf2j2ZtzigYi","spotify:track:3ydFRJUABULlXklU1M24TV","spotify:track:4fVxlf4IxJNJl8OmPsQ2C1"]);
        // console.log('Added tracks to playlist! ', addResponseData);
        console.log('Added tracks to playlist! ', snapshot_id)
        res.status(200).json({ data: 'Songs added successfully!' });

      } catch (error) {
        console.log(error);
        res.status(500).json({ data: 'Internal server error' });
        return;
      } 
}

