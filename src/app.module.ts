import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductsModule } from './products/products.module';

@Module({
  imports: [
    ProductsModule,
    UsersModule,
    MongooseModule.forRoot(process.env.MONGODB_CONNECT_URL),
  ],
})
export class AppModule {}
