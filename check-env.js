const fs = require('fs');
const env = fs.readFileSync('.env.production.local', 'utf8');
const lines = env.split('\n');
for (const line of lines) {
  if (line.includes('DATABASE_URL')) {
    console.log(line.substring(0, 120));
  }
}
