import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from './dbconnect';
import Party, { PartyType } from './models/party';

export default async function checkAccessCode(req: NextApiRequest, res: NextApiResponse) {
  const { accessCode } = req.query;
  
  try {
    // Connect to the database
    await dbConnect();

    // Check if a party with the given access code exists
    const party: PartyType | null = await Party.findOne({ access_code: accessCode });

    if (party) {
      // If a matching party is found, return the invite link
      res.status(200).json({ inviteLink: party.invite_link });
    } else {
      // If no matching party is found, return null
      res.status(404).json({ error: 'Party not found' });
    }
  } catch (error: any) {
    // Handle any errors that occur during the database query or connection
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
