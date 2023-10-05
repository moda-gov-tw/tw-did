const { existsSync, copyFileSync } = require('fs');
const { join } = require('path');

function copyEnvFile() {
  const serverPath = join(__dirname, '..');
  const targetPath = join(serverPath, '.env.local');
  const examplePath = join(serverPath, '.env.example');

  if (!existsSync(targetPath)) {
    console.log('.env.local not exists, copy from .env.example');
    copyFileSync(examplePath, targetPath);
  } else {
    console.log('.env.local does exist, do nothing.');
  }
}

if (require.main === module) {
  copyEnvFile();
}
