import {
    Controller,
    Post,
    UseInterceptors,
    UploadedFile,
    Body,
  } from '@nestjs/common';
  import { FileInterceptor } from '@nestjs/platform-express';
  import { MediaService } from 'src/service/media.service';
  import { ProductsService } from 'src/service/products.service';
  
  @Controller('products')
  export class ProductsController {
    constructor(
      private readonly mediaService: MediaService,
      private readonly productsService: ProductsService,
    ) {}
  
    @Post()
    @UseInterceptors(FileInterceptor('image'))
    async createProduct(
      @UploadedFile() file: Express.Multer.File,
      @Body() body: any,
    ) {
      if (!file) {
        throw new Error('Image file is required');
      }
  
      const imageUrl = await this.mediaService.uploadImage(file);
  
      const productPayload = {
        name: body.name,
        description: body.description,
        price: parseFloat(body.price),
        materials: JSON.parse(body.materials),
        style: body.style,
        tenantId: body.tenantId,
        gallery: [imageUrl],
        model: '',
      };
  
      return await this.productsService.createProduct(productPayload);
    }
  }
  