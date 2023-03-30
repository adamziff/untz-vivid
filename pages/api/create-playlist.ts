import type { NextApiRequest, NextApiResponse } from 'next';
// import { loadEnvConfig } from '@next/env';
import dbConnect from './dbconnect';
import Party from './models/party';

var SpotifyWebApi = require('spotify-web-api-node');

// const env = loadEnvConfig(process.cwd());

const clientId = 'f5e1c0e33ba2435ca10ef8beb593984d';
const clientSecret = process.env.CLIENT_SECRET;
// const redirectUri = 'http://localhost:3000/host/waiting'
const redirectUri = process.env.BASE_URL + '/host/waiting'
// const authCode = process.env.UNTZ_SPOTIFY_AUTH_CODE;
// console.log('create-playlist.ts: authCode')
// console.log(authCode)
const access_token = process.env.SPOTIFY_ACCESS_TOKEN
const refresh_token = process.env.SPOTIFY_REFRESH_TOKEN

// Setting credentials can be done in the wrapper's constructor, or using the API object's setters.
var spotifyApi = new SpotifyWebApi({
    redirectUri: redirectUri,
    clientId: clientId,
    clientSecret: clientSecret
});

type Data = {
  data: string;
  link: string;
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
    // const authCode = req.query.code
    // const accessCode = req.query.accessCode
    const partyName = req.query.partyName

    try {
        await dbConnect();
        console.log('Connected to MongoDB Atlas');

        // Retrieve an access token and a refresh token
        console.log('create-playlist.ts: starting authcodegrant')

        // const { body: { access_token, refresh_token } } = await spotifyApi.authorizationCodeGrant(authCode);
        // console.log('access_token')
        // console.log(access_token)
        // console.log('refresh_token')
        // console.log(refresh_token)
        // spotifyApi.setAccessToken(access_token);
        spotifyApi.setRefreshToken(refresh_token);

        spotifyApi.refreshAccessToken().then(
          async function(data: any) {
            console.log('The access token has been refreshed!');
        
            // Save the access token so that it's used in future calls
            spotifyApi.setAccessToken(data.body['access_token']);

            // const { body: { id: playlistId, uri: playlistUri } } = await spotifyApi.createPlaylist(partyName, { 'description': 'created with üntz.studio', 'public': true });
            const { body: playlist } = await spotifyApi.createPlaylist(partyName, { 'description': 'created with üntz.studio', 'public': true });
            console.log('Created playlist!', playlist);
            // console.log('Created playlist!', playlistId);
            // console.log('Playlist URI:', playlistUri);


            // const { body: snapshot_id } = await spotifyApi.addTracksToPlaylist(playlist.id, songs);
            const batchSize = 100; // Number of tracks to add at once
            const trackSections = Math.ceil(songs.length / batchSize);

            let snapshotId;
            for (let i = 0; i < trackSections; i++) {
              const startIndex = i * batchSize;
              const endIndex = startIndex + batchSize;
              const tracksToAdd = songs.slice(startIndex, endIndex);

              const { body } = await spotifyApi.addTracksToPlaylist(playlist.id, tracksToAdd);
              snapshotId = body.snapshot_id;
            }
            console.log('Added tracks to playlist! ', snapshotId)
            res.status(200).json({ data: 'Songs added successfully!', link: playlist.external_urls.spotify });
          },
          function(err: any) {
            console.log('Could not refresh access token', err);
          }
        );
      } catch (error) {
        console.log(error);
        res.status(500).json({ data: 'Internal server error', link: '' });
        return;
      } 
}

