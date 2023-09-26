const { setupDb } = require('./setup-db');
const shell = require('shelljs');

const outputFile = setupDb();

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
