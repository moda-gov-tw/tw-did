const { join } = require('path');
const shell = require('shelljs');
require('dotenv').config({
  path: join(__dirname, '..', '.env.local'),
});

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

const command = `docker run \
--name ${process.env.MONGO_CONTAINER_NAME} \
-e MONGO_INITDB_ROOT_USERNAME=${process.env.MONGO_INITDB_ROOT_USERNAME} \
-e MONGO_INITDB_ROOT_PASSWORD=${process.env.MONGO_INITDB_ROOT_PASSWORD} \
-p 27017:27017 \
-v ${outputFile}:/docker-entrypoint-initdb.d/init-mongo.js:ro \
mongo`;

shell.exec(`docker stop ${process.env.MONGO_CONTAINER_NAME}`);
shell.exec(`docker rm ${process.env.MONGO_CONTAINER_NAME}`);
shell.exec(command);
