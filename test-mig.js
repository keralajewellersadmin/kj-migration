const { sql } = require('@payloadcms/db-postgres');
const payload = require('payload');
async function run() {
  const p = await payload.getPayload({ config: require('./payload.config').default });
  console.log('db keys:', Object.keys(p.db));
  if (p.db.drizzle) console.log('drizzle keys:', Object.keys(p.db.drizzle));
  process.exit(0);
}
run();
