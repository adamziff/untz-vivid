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

    const songs = req.query.songs ? JSON.parse(req.query.songs as string) as string[] : [];
    const authCode = req.query.code
    const accessCode = req.query.accessCode
    const partyName = req.query.partyName

    try {
        await dbConnect();
        console.log('Connected to MongoDB Atlas');

        // Retrieve an access token and a refresh token
        console.log('create-playlist.ts: starting authcodegrant')

        const { body: { access_token, refresh_token } } = await spotifyApi.authorizationCodeGrant(authCode);
        spotifyApi.setAccessToken(access_token);
        spotifyApi.setRefreshToken(refresh_token);

        const { body: { id: playlistId } } = await spotifyApi.createPlaylist(partyName, { 'description': 'created with üntz.studio', 'public': true });
        console.log('Created playlist!', playlistId);


        const { body: snapshot_id } = await spotifyApi.addTracksToPlaylist(playlistId, songs);
        console.log('Added tracks to playlist! ', snapshot_id)
        res.status(200).json({ data: 'Songs added successfully!' });

      } catch (error) {
        console.log(error);
        res.status(500).json({ data: 'Internal server error' });
        return;
      } 
}

