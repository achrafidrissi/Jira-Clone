// features/workspaces/api/send-email.ts
import { Client, Messaging } from 'node-appwrite';

interface SendEmailParams {
  productOwnerEmail: string;
  topic: string;
  message: string;
}

export async function sendEmail({ productOwnerEmail, topic, message }: SendEmailParams) {
  try {
    const client = new Client()
      .setEndpoint('https://cloud.appwrite.io/v1')
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '')
      .setKey(process.env.APPWRITE_API_KEY || '');

    const messaging = new Messaging(client);

    const response = await messaging.createEmail(
      crypto.randomUUID(), // Unique ID for the message
      `Project Communication: ${topic}`,
      message,
      [], // topics
      [], // users
      [productOwnerEmail], // targets
      [], // cc
      [], // bcc
      [], // attachments
      false, // draft
      false, // html
      '' // scheduledAt
    );

    return {
      success: true,
      data: response
    };
  } catch (error: any) {
    console.error('Email sending error:', error);
    throw new Error(error.message || 'Failed to send email');
  }
}