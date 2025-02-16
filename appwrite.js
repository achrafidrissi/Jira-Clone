// appwrite.js
import { Client, Messaging, Users } from 'appwrite';

const client = new Client();

client
  .setEndpoint('https://cloud.appwrite.io/v1') // Replace with your endpoint
  .setProject('<PROJECT_ID>'); // Replace with your project ID

export const messaging = new Messaging(client);
export const users = new Users(client);
