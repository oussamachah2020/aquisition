import 'dotenv/config';

export default {
  schema: './src/models/*.js',
  out: './drizzle',
  dialect: 'postgresql',
  // Prefer DATABASE_URL_MIGRATE when set (host-local Neon Local), fallback to DATABASE_URL
  dbCredentials: {
    url: process.env.DATABASE_URL_MIGRATE || process.env.DATABASE_URL,
  },
};
