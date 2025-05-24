import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { MediaService } from 'src/service/media.service';
import { ProductsService } from 'src/service/products.service';
import { ApiTags, ApiOperation, ApiParam, ApiQuery, ApiBody } from '@nestjs/swagger';
import { CreateProductDto } from 'src/dto/create-product.dto';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(
    private readonly mediaService: MediaService,
    private readonly productsService: ProductsService,
  ) { }

  @Post()
  @ApiOperation({ summary: 'Create a new product' })
  @UseInterceptors(FilesInterceptor('images'))
  @ApiBody({ type: CreateProductDto })
  async createProduct(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() body: any,
  ) {
    const urls = await Promise.all(files.map(file => this.mediaService.uploadImage(file)));

    const productPayload = {
      name: body.name,
      description: body.description,
      price: parseFloat(body.price),
      materials: JSON.parse(body.materials),
      style: body.style,
      tenantId: body.tenantId,
      gallery: urls,
      model: '',
    };

    return this.productsService.createProduct(productPayload);
  }

  @Put(':tenantId/:productId')
  @ApiOperation({ summary: 'Update a product' })
  @ApiParam({ name: 'tenantId', type: String })
  @ApiParam({ name: 'productId', type: String })
  @UseInterceptors(FilesInterceptor('images'))
  async updateProduct(
    @Param('tenantId') tenantId: string,
    @Param('productId') productId: string,
    @UploadedFiles() files: Express.Multer.File[],
    @Body() body: any,
  ) {
    let gallery: string[] = [];

    if (files?.length) {
      gallery = await Promise.all(files.map(file => this.mediaService.uploadImage(file)));
    } else if (body.gallery) {
      gallery = JSON.parse(body.gallery);
    }

    const productPayload = {
      name: body.name,
      description: body.description,
      price: parseFloat(body.price),
      materials: JSON.parse(body.materials),
      style: body.style,
      tenantId,
      gallery,
      model: body.model || '',
    };

    return this.productsService.updateProduct(tenantId, productId, productPayload);
  }

  @Get(':tenantId')
  @ApiOperation({ summary: 'Get a list of products with pagination' })
  @ApiParam({ name: 'tenantId', type: String })
  @ApiQuery({ name: 'page', required: false })
  async getProducts(
    @Param('tenantId') tenantId: string,
    @Query('page') page: string,
    @Query('size') size: string,
  ) {
    const pageNumber = parseInt(page) || 0;
    const sizeNumber = parseInt(size) || 10;
    return this.productsService.getProducts(tenantId, pageNumber, sizeNumber);
  }

  @Get('id/:productId')
  @ApiOperation({ summary: 'Get a product by Id' })
  @ApiParam({ name: 'productId', type: String })
  async getProductById(@Param('productId') productId: string) {
    return this.productsService.getProductById(productId);
  }

  @Post('batch')
  @ApiOperation({ summary: 'Get a products batch' })
  @ApiBody({ schema: { type: 'array', items: { type: 'string' } } })
  async getProductsBatch(@Body() productIds: string[]) {
    return this.productsService.getProductsBatch(productIds);
  }
}
