import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ProductsController } from './controller/products.controller';
import { MediaService } from './service/media.service';
import { ProductsService } from './service/products.service';

@Module({
  imports: [HttpModule],
  controllers: [ProductsController],
  providers: [MediaService, ProductsService],
})
export class AppModule {}
