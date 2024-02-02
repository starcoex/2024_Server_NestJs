import { Module } from '@nestjs/common';
import * as Joi from 'joi';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { join } from 'path';
import { UserModule } from './user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration';
import { PrismaModule } from 'nestjs-prisma';
import { CommonModule } from './common/common.module';
import { ProfileModule } from './profile/profile.module';
import { AddressModule } from './address/address.module';
import { JwtModule } from './jwt/jwt.module';
import { AuthModule } from './auth/auth.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { MailgunMailModule } from './mailgun-mail/mailgun-mail.module';
import { UserService } from './user/user.service';
import { PrismaService } from './prisma/prisma.service';
import { MailerMailService } from './mailer-mail/mailer-mail.service';
import { RestaurantsModule } from './restaurants/restaurants.module';
import { CategoryModule } from './category/category.module';
import { TOKEN_KEY } from './common/common.constants';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ProfileService } from './profile/profile.service';
import { DishModule } from './dish/dish.module';
import { OrdersModule } from './orders/orders.module';
import { PaymentsModule } from './payments/payments.module';
import mailerConfig from './config/mailer.config';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), '..', 'public'),
      serveRoot: '/',
    }),
    PrismaModule.forRoot({
      isGlobal: true,
      prismaServiceOptions: {
        explicitConnect: true,
        prismaOptions: {
          log: ['info', 'query', 'warn', 'error'],
        },
      },
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      ignoreEnvFile: process.env.NODE_ENV === 'production',
      envFilePath:
        process.env.NODE_ENV === 'production'
          ? `${process.cwd()}/src/config/env/.production.env`
          : process.env.NODE_ENV === 'stage'
          ? `${process.cwd()}/src/config/env/.stage.env`
          : `${process.cwd()}/src/config/env/.development.env`,
      load: [configuration, mailerConfig],
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'prodution', 'stage')
          .required(),
        PORT: Joi.number().required(),
        TOKEN_SECRET: Joi.string().required(),
        DATABASE_URL: Joi.string().required(),
        MAILGUN_KEY: Joi.string().required(),
        MAILGUN_DOMAIN_NAME: Joi.string().required(),
        MAILGUN_URL: Joi.string().required(),
      }),
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      installSubscriptionHandlers: true,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      playground: false,
      sortSchema: true,
      path: 'graphql',
      csrfPrevention: false,
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
      subscriptions: {
        'subscriptions-transport-ws': {
          path: '/graphql',
          onConnect: async (connectionParams) => {
            return { token: connectionParams[TOKEN_KEY] };
          },
        },
      },
      context: ({ req }) => ({ token: req.headers[TOKEN_KEY] }),
    }),
    JwtModule.forRoot({
      privateKey: process.env.TOKEN_SECRET,
      refreshKey: process.env.TOKEN_REFRESH,
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          ...config.get('email'),
          template: {
            dir: join(__dirname, 'templates'),
            adapter: new HandlebarsAdapter(),
            options: { strict: true },
          },
        };
      },
    }),
    MailgunMailModule.forRoot({
      key: process.env.MAILGUN_KEY,
      username: process.env.MAILGUN_DOMAIN_NAME,
      url: process.env.MAILGUN_URL,
    }),
    UserModule,
    CommonModule,
    ProfileModule,
    AddressModule,
    AuthModule,
    RestaurantsModule,
    CategoryModule,
    DishModule,
    OrdersModule,
    PaymentsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    UserService,
    PrismaService,
    MailerMailService,
    ProfileService,
  ],
})
// export class AppModule implements NestModule {
//   configure(consumer: MiddlewareConsumer) {
//     consumer.apply(JwtMiddleware).forRoutes({
//       path: 'graphql',
//       method: RequestMethod.ALL,
//     });
//   }
export class AppModule {}
