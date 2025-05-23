export const config = {
  PORT: process.env.PORT ? parseInt(process.env.PORT, 10) : 8080,
  NODE_ENV: process.env.NODE_ENV || 'development',
  CORS_ORIGIN: process.env.CORS_ORIGIN || '*',
};
