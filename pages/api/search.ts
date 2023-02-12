// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

var SpotifyWebApi = require('spotify-web-api-node');

const clientId = 'f5e1c0e33ba2435ca10ef8beb593984d';
const clientSecret = 'ff8ae941089642a2b9d429c9bb075043';

// Create the api object with the credentials
var spotifyApi = new SpotifyWebApi({
  clientId: clientId,
  clientSecret: clientSecret
});

type Data = {
  name: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {

  // Retrieve an access token.
  spotifyApi.clientCredentialsGrant().then(
    function(data: any) {
      // console.log('The access token expires in ' + data.body['expires_in']);
      // console.log('The access token is ' + data.body['access_token']);

      // Save the access token so that it's used in future calls
      spotifyApi.setAccessToken(data.body['access_token']);
    },
    function(err: any) {
      console.log('Something went wrong when retrieving an access token', err);
    }
  );
  // console.log('req.query.q');
  // console.log(req.query.q);
  spotifyApi.searchTracks(req.query.q, {limit: 5})
  .then(function(data: any) {
    console.log('Search', data.body);
    res.status(200).json(data.body)
  }, function(err: any) {
    console.error(err);
  });
}
