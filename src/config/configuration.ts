export default () => ({
  port: Number(process.env.PORT) || 4000,
  database: {
    url: process.env.DATABASE_URL,
    port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
  },
  DATABASE_URL:
    'postgresql://junghoonko:randompassword@localhost:5432/nuber-prisma-two?schema=public',
});
