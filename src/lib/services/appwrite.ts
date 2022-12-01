import { PUBLIC_APPWRITE_ENDPOINT, PUBLIC_APPWRITE_PROJECT_ID } from '$env/static/public';
import { Account, Client, Databases } from 'appwrite';

export const client = new Client()
  .setEndpoint(PUBLIC_APPWRITE_ENDPOINT)
  .setProject(PUBLIC_APPWRITE_PROJECT_ID);
export const databases = new Databases(client);
export const account = new Account(client);

export enum AppwriteExceptionType {
  'INVALID_CREDENTIALS' = 'user_invalid_credentials'
}
