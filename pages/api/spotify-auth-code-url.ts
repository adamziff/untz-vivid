import type { NextApiRequest, NextApiResponse } from 'next';
// import { loadEnvConfig } from '@next/env';
import { useRouter } from 'next/router';

var SpotifyWebApi = require('spotify-web-api-node');

type Data = {
  message: string;
  data: any
};

// const env = loadEnvConfig(process.cwd());

const allowedOrigins = [
  'www.untz.studio',
  'untz-vivid.vercel.app',
  'untz-vivid-adamziff.vercel.app',
];

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
    // const router = useRouter()

    const clientId = 'f5e1c0e33ba2435ca10ef8beb593984d';
    const clientSecret = process.env.CLIENT_SECRET;
    var scopes = ['user-read-private', 'user-read-email', 'playlist-modify-public', 'playlist-modify-private', 'playlist-read-private', 'playlist-read-collaborative'],
    // redirectUri = 'http://localhost:3000/host/waiting', 
    redirectUri = process.env.BASE_URL + '/host/waiting', 
    state=req.query.accessCode

    // Create the api object with the credentials
    var spotifyApi = new SpotifyWebApi({
        clientId: clientId,
        clientSecret: clientSecret,
        redirectUri: redirectUri
    });

    // Set up CORS
    const origin = req.headers.origin ? req.headers.origin : '';
    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }

    try {
        // if (spotifyApi & spotifyApi.createAuthorizeURL) {
            // Create the authorization URL
            // var authorizeURL = spotifyApi.createAuthorizeURL({
            //     scope: scopes,
            //     redirectUri: redirectUri
            // });
            var authorizeURL = spotifyApi.createAuthorizeURL(scopes, state);
            console.log('authorizeURL')
            console.log(authorizeURL)
            res.status(200).json({ message: 'spotify authorization code url created', data: authorizeURL });
        // } else {
        //     console.log('unsuccessful: something doesnt exist');
        //     console.log(spotifyApi)
        //     console.log(spotifyApi.createAuthorizeURL)
        //     res.status(500).json({ message: 'Internal server error', data: '' });
        // }
        
        
    } catch (error) {
        console.log('unsuccessful');
        console.log(error);
        res.status(500).json({ message: 'Internal server error', data: error });

  } 
    
}

