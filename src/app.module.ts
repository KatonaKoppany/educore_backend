import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TokenService } from './token/token.service';
import { TokenModule } from './token/token.module';
import { UserController } from './user/user.controller';
import { UserModule } from './user/user.module';
import { TestModule } from './test/test.module';
import config from './config/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      load: [config],
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (config) => ({
        secret: config.get('jwt.jwtSecret'),
        signOptions: { expiresIn: '1h' },
      }),
      global: true,
      inject: [ConfigService],
    }),

    PrismaModule,
    AuthModule,
    TokenModule,
    UserModule,
    TestModule,
  ],
  controllers: [AppController, UserController],
  providers: [AppService, TokenService],
})
export class AppModule {}
