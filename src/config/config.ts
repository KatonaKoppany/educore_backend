export default () => ({
  app: {
    isProduction: process.env.NODE_ENV === 'production',
    frontendUrl: process.env.FRONTEND_URL,
    port: process.env.PORT,
  },

  database: {
    connectionString: process.env.DATABASE_URL,
  },

  jwt: {
    jwtSecret: process.env.JWT_SECRET,
  },
});
