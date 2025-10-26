import 'dotenv/config';

import { neon, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

// Validate DATABASE_URL is provided
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is required');
}

if (process.env.NODE_ENV === 'development') {
  neonConfig.fetchEndpoint = 'http://neon-local:5432/sql';
  neonConfig.useSecureWebSocket = false;
  neonConfig.poolQueryViaFetch = true;
}

// Log database connection info (without sensitive data)
const dbUrl = new URL(process.env.DATABASE_URL);
console.log(
  `Connecting to database: ${dbUrl.hostname}:${
    dbUrl.port
  }/${dbUrl.pathname.slice(1)}`
);

const sql = neon(process.env.DATABASE_URL);

const db = drizzle(sql);

export { db, sql };
