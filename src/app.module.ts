import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { CheckoutModule } from './checkout/checkout.module';
import { AuthMiddleware } from './middleware/auth.middleware';
import { FilesBucketModule } from './modules/aws';
import { OrdersController } from './orders/orders.controller';
import { OrdersModule } from './orders/orders.module';
import { ProductCategoriesModule } from './product-categories/product-categories.module';
import { ProductsModule } from './products/products.module';
import { UsersModule } from './users/users.module';
import { SearchModule } from './routes';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get('MONGODB_CONNECT_URL'),
      }),
      inject: [ConfigService],
    }),
    ProductsModule,
    UsersModule,
    OrdersModule,
    ProductCategoriesModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    FilesBucketModule,
    CheckoutModule,
    SearchModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).exclude().forRoutes(OrdersController);
  }
}
