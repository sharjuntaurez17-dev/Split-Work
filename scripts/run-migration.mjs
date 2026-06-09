// One-off migration runner. Reads the Postgres connection string from a local
// env file (git-ignored) and executes a .sql file. Not committed-secret-safe by
// itself — the env file it reads is git-ignored.
import { readFileSync } from 'node:fs'
import pg from 'pg'

function envFromFile(path) {
  const out = {}
  for (const line of readFileSync(path, 'utf8').split('\n')) {
    const m = line.match(/^([A-Z0-9_]+)="?(.*?)"?$/)
    if (m) out[m[1]] = m[2]
  }
  return out
}

const env = envFromFile(process.argv[2] || '.env.db.tmp')
const conn = env.POSTGRES_URL_NON_POOLING || env.POSTGRES_URL
if (!conn) { console.error('No POSTGRES_URL(_NON_POOLING) found'); process.exit(1) }

const sql = readFileSync(process.argv[3], 'utf8')

const client = new pg.Client({ connectionString: conn, ssl: { rejectUnauthorized: false } })
const r = await client.connect().then(() => client.query(sql))
  .then(() => 'OK')
  .catch(e => { console.error('SQL ERROR:', e.message); process.exitCode = 1; return 'FAIL' })
  .finally(() => client.end())
console.log('Migration:', r)
