// pages/api/send-email.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { sendEmail } from '@/features/workspaces/api/send-email';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { productOwnerEmail, topic, message } = req.body;

    if (!productOwnerEmail || !topic || !message) {
      return res.status(400).json({ 
        message: 'Missing required fields' 
      });
    }

    const result = await sendEmail({
      productOwnerEmail,
      topic,
      message
    });

    return res.status(200).json(result);
  } catch (error: any) {
    console.error('API error:', error);
    return res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to send email' 
    });
  }
}