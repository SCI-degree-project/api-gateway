import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UploadedFiles,
  UseInterceptors,
  Patch,
  Delete,
} from '@nestjs/common';
import { MediaService } from 'src/service/media.service';
import { ProductsService } from 'src/service/products.service';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiParam, ApiQuery, ApiBody } from '@nestjs/swagger';
import { CreateProductDto } from 'src/dto/create-product.dto';
import { UpdateProductDto } from 'src/dto/update-product.dto';
import { ProductSearchCriteriaDto } from 'src/dto/product-search-criteria.dto';
import { GallertItem } from 'src/domain/GalleryItem';

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

    const finalGalleryItems = galleryUrls.map((url, index) => ({
      imageUrl: url,
      altText: imageFiles[index].originalname,
    }));

    const productPayload: any = {
      name: body.name,
      description: body.description,
      price: Number(body.price),

      materials: Array.isArray(body.materials)
        ? body.materials
        : [body.materials].filter(Boolean),

      style: body.style,
      tenantId: body.tenantId,

      media: {
        gallery: finalGalleryItems,
        model: modelUrl,
      },

      dimensions: body.dimensions,
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

    let finalGallery: GallertItem[] | undefined;
    let finalModelUrl: string | undefined;

    if (imageFiles.length > 0) {
      const uploadedUrls = await Promise.all(
        imageFiles.map(file => this.mediaService.uploadFile(file)),
      );

      finalGallery = uploadedUrls.map((url, index) => ({
        imageUrl: url,
        altText: imageFiles[index].originalname,
      }));

    } else if (body.media?.gallery) {
      finalGallery = body.media.gallery;
    }

    if (modelFile) {
      finalModelUrl = await this.mediaService.uploadFile(modelFile);
    } else if (body.media?.model) {
      finalModelUrl = body.media.model;
    }

    const productPayload: any = {
      tenantId,
    };

    if (finalGallery !== undefined || finalModelUrl !== undefined) {
      productPayload.media = {
        gallery: finalGallery,
        model: finalModelUrl,
      };
    }

    if (body.name !== undefined) productPayload.name = body.name;
    if (body.description !== undefined) productPayload.description = body.description;
    if (body.price !== undefined) productPayload.price = Number(body.price);

    if (body.materials !== undefined) {
      productPayload.materials = Array.isArray(body.materials)
        ? body.materials
        : [body.materials].filter(Boolean);
    }

    if (body.style !== undefined) productPayload.style = body.style;

    if (body.dimensions !== undefined) {
      productPayload.dimensions = body.dimensions;
    }

    Object.keys(productPayload).forEach(key => productPayload[key] === undefined && delete productPayload[key]);

    return this.productsService.patchProduct(tenantId, productId, productPayload);
  }

  @Get(':tenantId')
  @ApiOperation({ summary: 'Get a list of products with pagination' })
  @ApiParam({ name: 'tenantId', type: String })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'size', required: false })
  async getProducts(
    @Param('tenantId') tenantId: string,
    @Query('page') page: string,
    @Query('size') size: string,
  ) {
    const pageNumber = parseInt(page) || 0;
    const sizeNumber = parseInt(size) || 20;
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

  @Delete(':tenantId/:productId')
  @ApiOperation({ summary: 'Delete a product' })
  @ApiParam({ name: 'tenantId', type: String })
  @ApiParam({ name: 'productId', type: String })
  async deleteProduct(
    @Param('tenantId') tenantId: string,
    @Param('productId') productId: string,
  ) {
    return this.productsService.deleteProduct(tenantId, productId);
  }
}
