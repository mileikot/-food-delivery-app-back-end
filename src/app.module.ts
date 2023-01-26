import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './categories/categories.module';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGODB_CONNECT_URL),
    ProductsModule,
    UsersModule,
    CategoriesModule,
  ],
})
export class AppModule {}
