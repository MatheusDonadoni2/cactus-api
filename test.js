const { execSync } = require('child_process');

execSync('npm run migrations:up');
