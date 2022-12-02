import { sdk } from './deps.ts';

/*
  'req' variable has:
    'headers' - object with request headers
    'payload' - request body data as a string
    'variables' - object with function variables

  'res' variable has:
    'send(text, status)' - function to return text response. Status code defaults to 200
    'json(obj, status)' - function to return JSON response. Status code defaults to 200
  
  If an error is thrown, a response with code 500 will be returned.
*/

export default async function (req: any, res: any) {
  const client = new sdk.Client();

  // You can remove services you don't use
  const account = new sdk.Account(client);
  const avatars = new sdk.Avatars(client);
  const database = new sdk.Databases(client);
  const functions = new sdk.Functions(client);
  const health = new sdk.Health(client);
  const locale = new sdk.Locale(client);
  const storage = new sdk.Storage(client);
  const teams = new sdk.Teams(client);
  const users = new sdk.Users(client);

  if (!req.variables['APPWRITE_FUNCTION_ENDPOINT'] || !req.variables['APPWRITE_FUNCTION_API_KEY']) {
    console.warn('Environment variables are not set. Function cannot use Appwrite SDK.');
  } else {
    client
      .setEndpoint(req.variables['APPWRITE_FUNCTION_ENDPOINT'] as string)
      .setProject(req.variables['APPWRITE_FUNCTION_PROJECT_ID'] as string)
      .setKey(req.variables['APPWRITE_FUNCTION_API_KEY'] as string);
  }

  const bucketId = '638806130c168e7691e7';

  const files = await storage.listFiles(bucketId);

  for (const file of files.files) {
    console.log('file', file);
    const res = await storage.getFileView(bucketId, file.$id);
    console.log(res, typeof res, file);
  }

  res.json({
    areDevelopersAwesome: true
  });
}
