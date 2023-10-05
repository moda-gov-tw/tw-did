const { join } = require('path');
const shell = require('shelljs');
require('dotenv').config({
  path: join(__dirname, '..', '.env.local'),
});

function setupDb() {
  let template = shell.cat(join(__dirname, 'init-mongo.js.template'));
  const replaceTerms = [
    'MONGO_DATABASE',
    'MONGO_DATABASE_USERNAME',
    'MONGO_DATABASE_PASSWORD',
  ];

  replaceTerms.forEach((term) => {
    template = template.replaceAll(`<${term}>`, process.env[term]);
  });

  const outputFile = join(__dirname, 'init-mongo.js');
  shell.ShellString(template).to(outputFile);
  return outputFile;
}

if (require.main === module) {
  setupDb();
}

module.exports = {
  setupDb,
};
