import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Body,
  Get,
  Query,
  Param,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MediaService } from 'src/service/media.service';
import { ProductsService } from 'src/service/products.service';
import { Throttle } from '@nestjs/throttler';

@Controller('products')
export class ProductsController {
  constructor(
    private readonly mediaService: MediaService,
    private readonly productsService: ProductsService,
  ) { }

  @Throttle({
    default: {
      limit: 4,
      ttl: 20,
    },
  })
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

  @Get(':tenantId')
  async getProducts(
    @Param('tenantId') tenantId: string,
    @Query('page') page: string,
    @Query('size') size: string,
  ) {
    const pageNumber = parseInt(page) || 0;
    const sizeNumber = parseInt(size) || 10;

    return await this.productsService.getProducts(tenantId, pageNumber, sizeNumber);
  }

  @Get(':tenantId/:productId')
  async getProductById(
    @Param('tenantId') tenantId: string,
    @Param('productId') productId: string,
  ) {
    return await this.productsService.getProductById(tenantId, productId);
  }

}
