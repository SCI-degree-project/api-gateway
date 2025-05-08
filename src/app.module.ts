import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ProductsController } from './controller/products.controller';
import { MediaService } from './service/media.service';
import { ProductsService } from './service/products.service';
import { ConfigModule } from '@nestjs/config';

import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    HttpModule,
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 30,
          limit: 10,
        },
      ],
    }),
    
  ],
  controllers: [ProductsController],
  providers: [
    ProductsService,
    MediaService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
