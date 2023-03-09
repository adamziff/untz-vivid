import type { NextApiRequest, NextApiResponse } from 'next';
// import { loadEnvConfig } from '@next/env';

var SpotifyWebApi = require('spotify-web-api-node');

// const env = loadEnvConfig(process.cwd());

const clientId = 'f5e1c0e33ba2435ca10ef8beb593984d';
const clientSecret = process.env.CLIENT_SECRET;

// Create the api object with the credentials
var spotifyApi = new SpotifyWebApi({
  clientId: clientId,
  clientSecret: clientSecret,
});

type Data = {
  name: string;
};

const allowedOrigins = [
  'www.untz.studio',
  'untz-vivid.vercel.app',
  'untz-vivid-adamziff.vercel.app',
];

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  // Set up CORS
  const origin = req.headers.origin ? req.headers.origin : '';
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  // Retrieve an access token.
  spotifyApi.clientCredentialsGrant().then(
    (data: any) => {
      // Save the access token so that it's used in future calls
      spotifyApi.setAccessToken(data.body['access_token']);

      spotifyApi
        .searchTracks(req.query.q, { limit: 5 })
        .then(
          (data: any) => {
            console.log('Search', data.body);
            res.status(200).json(data.body);
          },
          (err: any) => {
            console.error(err);
            res.status(500).json(err);
          }
        );
    },
    (err: any) => {
      console.log('Something went wrong when retrieving an access token', err);
      res.status(500).json(err);
    }
  );
}

