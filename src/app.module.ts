import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import typeorm from './config/typeorm';
import { FilesBucketModule } from './modules/aws';
import { AuthModule } from './routes/auth/auth.module';
import { CheckoutModule } from './routes/checkout/checkout.module';
import { ManagersModule } from './routes/managers/managers.module';
import { OrderReviewsModule } from './routes/order-reviews/order-reviews.module';
import { OrdersModule } from './routes/orders/orders.module';
import { ProductReviewsModule } from './routes/product-reviews/product-reviews.module';
import { ProductsModule } from './routes/products/products.module';
import { SearchModule } from './routes/search/search.module';
import { UsersModule } from './routes/users/users.module';
import { VerficationPhoneNumberModule } from './routes/verification-phone-numbers/verification-phone-numbers.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [typeorm],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) =>
        configService.get('typeorm') ?? {},
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
    OrderReviewsModule,
    ProductReviewsModule,
  ],
})
export class AppModule {}
