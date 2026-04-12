const fs = require('fs');
const path = require('path');

// Configure the path to the environment file
const targetPath = path.join(__dirname, '../src/environments/environment.prod.ts');

// Create the environment file content (do NOT include Firebase secrets in
// generated files; Firebase is intentionally removed from the repository).
const envConfigFile = `export const environment = {
  production: true,
  apiUrl: 'https://api.3dime.com',
  // Firebase configuration removed - add local/untracked config if required.
};
`;

// Write the file
fs.writeFile(targetPath, envConfigFile, function (err) {
    if (err) {
        console.error(err);
        throw err;
    }
    console.log(`Environment file generated at ${targetPath}`);
});
