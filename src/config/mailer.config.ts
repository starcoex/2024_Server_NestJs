import 'dotenv/config';

export default () => ({
  email: {
    transport: `smtps://${process.env.MAILER_AUTH_USER}:${process.env.MAILER_AUTH_PASSWORD}@${process.env.MAILER_HOST}`,
    defaults: {
      from: `"${process.env.MAILER_FROM_USER_NAME}" <${process.env.MAILER_AUTH_USER}>`,
    },
  },
});
