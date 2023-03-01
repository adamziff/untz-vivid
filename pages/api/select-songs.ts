import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
  message: string;
  data: any
};

const allowedOrigins = [
  'www.untz.studio',
  'untz-vivid.vercel.app',
  'untz-vivid-adamziff.vercel.app',
];

const playlistId = 0

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  console.log(req.body.bars)
  // Set up CORS
  const origin = req.headers.origin ? req.headers.origin : '';
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  try {
    const response = await fetch('https://untz-backend.azurewebsites.net/api/data');
    const data = await response.json();
    // const { data } = await response.json();
    console.log('returned data:');
    console.log(data); // { data: 'Hello, World!' }

    console.log('fetching songs from playlist with id' + playlistId);
    res.status(200).json({ message: 'python server accessed successfully', data: data });
    // res.status(200).json({ message: 'Songs selected successfully!', data });



  } catch (error) {
    console.log('unsuccessful');
    console.log(error);
    res.status(500).json({ message: 'Internal server error', data: error });

  } 

}

    
