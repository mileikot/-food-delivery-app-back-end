import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ProductsModule } from './products/products.module';
import { ProductCategoriesModule } from './product-categories/product-categories.module';
import { AuthMiddleware } from './middleware/auth.middleware';
import { OrdersModule } from './orders/orders.module';
import { OrderStatusesModule } from './order-statuses/order-statuses.module';
import { OrdersController } from './orders/orders.controller';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_CONNECT_URL'),
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
    OrderStatusesModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).exclude().forRoutes(OrdersController);
  }
}
