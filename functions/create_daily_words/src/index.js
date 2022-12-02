const sdk = require('node-appwrite');

function arrayBufferToStr(buffer) {
  var binary = '';
  var bytes = new Uint8Array(buffer);
  var len = bytes.byteLength;
  for (var i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return binary;
}

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

module.exports = async function (req, res) {
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
      .setEndpoint(req.variables['APPWRITE_FUNCTION_ENDPOINT'])
      .setProject(req.variables['APPWRITE_FUNCTION_PROJECT_ID'])
      .setKey(req.variables['APPWRITE_FUNCTION_API_KEY'])
      .setSelfSigned(true);
  }

  const bucketId = '638806130c168e7691e7';

  const files = await storage.listFiles(bucketId);

  for (const file of files.files.slice(0, 1)) {
    const res = await storage.getFileView(bucketId, file.$id);
    const resStr = arrayBufferToStr(res);

    const words = arrayBufferToStr(buffer)
      .split('')
      .reduce((acc, curr, idx) => {
        if (curr.trim()) {
          const prevAcc = [...acc];
          const lastIndex = acc.length > 0 ? acc.length - 1 : 0;
          prevAcc[lastIndex] = (prevAcc[lastIndex] ?? '') + curr.trim();
          return prevAcc;
        }

        return [...acc, ''];
      }, [])
      .filter(Boolean);
  }

  res.json({
    areDevelopersAwesome: true
  });
};