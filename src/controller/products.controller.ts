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
  Patch,
} from '@nestjs/common';
import { MediaService } from 'src/service/media.service';
import { ProductsService } from 'src/service/products.service';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiParam, ApiQuery, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { CreateProductDto } from 'src/dto/create-product.dto';
import { UpdateProductDto } from 'src/dto/update-product.dto';
import { ProductSearchCriteriaDto } from 'src/dto/product-search-criteria.dto';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(
    private readonly mediaService: MediaService,
    private readonly productsService: ProductsService,
  ) { }

  @Post()
  @ApiOperation({ summary: 'Create a new product' })
  @ApiBody({ type: CreateProductDto })
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'gallery', maxCount: 10 },
      { name: 'model', maxCount: 1 },
    ])
  )
  async createProduct(
    @UploadedFiles() files: {
      gallery?: Express.Multer.File[];
      model?: Express.Multer.File[];
    },
    @Body() body: CreateProductDto,
  ) {
    const imageFiles = files.gallery || [];
    const modelFile = files.model?.[0];

    if (imageFiles.length === 0) {
      throw new Error('At least one image is required');
    }

    const galleryUrls = await Promise.all(
      imageFiles.map(file => this.mediaService.uploadFile(file)),
    );

    let modelUrl = '';
    if (modelFile) {
      modelUrl = await this.mediaService.uploadFile(modelFile);
    }

    const productPayload = {
      name: body.name,
      description: body.description,
      price: Number(body.price),
      materials: Array.isArray(body.materials)
        ? body.materials
        : JSON.parse(body.materials),
      style: body.style,
      tenantId: body.tenantId,
      gallery: galleryUrls,
      model: modelUrl,
    };

    return this.productsService.createProduct(productPayload);
  }

  @Patch(':tenantId/:productId')
  @ApiOperation({ summary: 'Update a product with new images or model' })
  @ApiParam({ name: 'tenantId', type: String })
  @ApiParam({ name: 'productId', type: String })
  @ApiBody({ type: UpdateProductDto })
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'gallery', maxCount: 10 },
      { name: 'model', maxCount: 1 },
    ])
  )
  async updateProduct(
    @Param('tenantId') tenantId: string,
    @Param('productId') productId: string,
    @UploadedFiles() files: {
      gallery?: Express.Multer.File[];
      model?: Express.Multer.File[];
    } = {},
    @Body() body: UpdateProductDto,
  ) {
    const imageFiles = files?.gallery || [];
    const modelFile = files?.model?.[0];

    let gallery: string[] = [];

    if (imageFiles.length > 0) {
      gallery = await Promise.all(
        imageFiles.map(file => this.mediaService.uploadFile(file)),
      );
    } else if (body.gallery) {
      gallery = Array.isArray(body.gallery)
        ? body.gallery
        : JSON.parse(body.gallery as any);
    }

    let modelUrl = '';
    if (modelFile) {
      modelUrl = await this.mediaService.uploadFile(modelFile);
    } else if (body.model) {
      modelUrl = body.model;
    }

    const productPayload: any = {
      tenantId,
      gallery,
      model: modelUrl,
    };

    if (body.name !== undefined) productPayload.name = body.name;
    if (body.description !== undefined) productPayload.description = body.description;
    if (body.price !== undefined) productPayload.price = Number(body.price);
    if (body.materials !== undefined) {
      productPayload.materials = Array.isArray(body.materials)
        ? body.materials
        : JSON.parse(body.materials as any);
    }
    if (body.style !== undefined) productPayload.style = body.style;

    return this.productsService.patchProduct(tenantId, productId, productPayload);
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

  @Post('search')
  @ApiOperation({ summary: 'Search products with criteria' })
  @ApiBody({ type: ProductSearchCriteriaDto })
  async searchProducts(
    @Body() criteria: ProductSearchCriteriaDto,
  ) {
    return this.productsService.searchProducts(criteria);
  }
}
