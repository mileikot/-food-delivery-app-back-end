import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FilesBucketModule } from './modules/aws';
import { AuthModule } from './routes/auth/auth.module';
import { CheckoutModule } from './routes/checkout/checkout.module';
import { ManagersModule } from './routes/managers/managers.module';
import { OrdersModule } from './routes/orders/orders.module';
import { ProductsModule } from './routes/products/products.module';
import { SearchModule } from './routes/search/search.module';
import { UsersModule } from './routes/users/users.module';
import { VerficationPhoneNumberModule } from './routes/verification-phone-numbers/verification-phone-numbers.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('HOST'),
        port: +configService.get('PORT'),
        username: configService.get('USERNAME'),
        password: configService.get('PASSWORD'),
        database: configService.get('DATABASE'),
        synchronize: true,
        autoLoadEntities: true,
      }),
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ProductsModule,
    UsersModule,
    OrdersModule,
    FilesBucketModule,
    CheckoutModule,
    SearchModule,
    VerficationPhoneNumberModule,
    ManagersModule,
    AuthModule,
  ],
})
export class AppModule {}
