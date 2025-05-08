import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ProductsController } from './controller/products.controller';
import { MediaService } from './service/media.service';
import { ProductsService } from './service/products.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    HttpModule,
  ],
  controllers: [ProductsController],
  providers: [ProductsService, MediaService],
})
export class AppModule {}
