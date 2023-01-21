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

module.exports = async function (req, res) {
  const client = new sdk.Client();

  const database = new sdk.Databases(client);
  const storage = new sdk.Storage(client);

  if (
    !req.variables['APPWRITE_FUNCTION_ENDPOINT'] ||
    !req.variables['APPWRITE_FUNCTION_API_KEY'] ||
    !req.variables['BUCKET_ID'] ||
    !req.variables['DATABASE_ID'] ||
    !req.variables['COLLECTION_ID']
  ) {
    return console.log('Environment variables are not set. Function cannot use Appwrite SDK.');
  } else {
    client
      .setEndpoint(req.variables['APPWRITE_FUNCTION_ENDPOINT'])
      .setProject(req.variables['APPWRITE_FUNCTION_PROJECT_ID'])
      .setKey(req.variables['APPWRITE_FUNCTION_API_KEY'])
      .setSelfSigned(true);
  }

  const [bucketId, databaseId, collectionId] = [
    req.variables['BUCKET_ID'],
    req.variables['DATABASE_ID'],
    req.variables['COLLECTION_ID']
  ];

  const files = await storage.listFiles(bucketId);

  for (const file of files.files) {
    try {
      console.log('Starting to process file: ', file.name, '...');
      const lang = file.name.split('.')[0];
      console.log('Language: ', lang);
      const res = await storage.getFileView(bucketId, file.$id);
      console.log('Read file...');
      const words = arrayBufferToStr(res)
        .split(/\n|\r/)
        .filter((w) => {
          return !!w && w.length === 5;
        });

      console.log(`Read ${words.length} words...`);

      // Randomly pick a word
      const dailyWord = words[Math.floor(Math.random() * words.length)];
      console.log('Daily word:', dailyWord);

      // Timestamp should be the current date, ignoring the time, but still in ISO format
      // e.g. if today is 17/11/1999, the timestamp should be 1999-11-17T00:00:00.000+00:00
      const timestamp = new Date().toISOString().split('T')[0] + 'T00:00:00.000+00:00';
      console.log('Timestamp:', timestamp);

      // Update the database
      await database.createDocument(databaseId, collectionId, 'unique()', {
        lang,
        word: dailyWord,
        created_at: timestamp
      });
      console.log('Updated database...\n');
    } catch (err) {
      console.log(err);
    }
  }

  res.json({
    ok: true
  });
};
