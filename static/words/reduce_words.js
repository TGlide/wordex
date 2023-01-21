import fs from 'fs';

// get all txt files from current directory
const files = fs.readdirSync('./').filter((f) => f.endsWith('.txt'));

for (const file of files) {
  const lang = file.split('.')[0];
  const words = fs
    .readFileSync(file, 'utf-8')
    .split(/\n|\r/)
    .filter((w) => {
      return !!w && w.length === 5;
    });

  fs.writeFileSync(`${lang}_five_letters.txt`, words.join('\n'), 'utf-8');
}
