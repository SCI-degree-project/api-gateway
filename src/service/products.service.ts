import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ProductsService {
  private baseUrl: string;

  constructor(
    private readonly http: HttpService,
    private readonly configService: ConfigService,
  ) {
    const baseUrl = this.configService.get<string>('PRODUCTS_API_URL');
    if (!baseUrl) {
      throw new Error('PRODUCTS_API_URL is not defined in environment variables');
    }
    this.baseUrl = baseUrl;

  }

  async createProduct(data: any) {
    const response = await firstValueFrom(
      this.http.post(this.baseUrl, data)
    );
    return response.data;
  }

  async getProducts(tenantId: string, page: number, size: number) {
    const response = await firstValueFrom(
      this.http.get(`${this.baseUrl}/${tenantId}`, {
        params: { page, size },
      })
    );
    return response.data;
  }

  async getProductById(tenantId: string, productId: string) {
    const response = await firstValueFrom(
      this.http.get(`${this.baseUrl}/${tenantId}/${productId}`)
    );
    return response.data;
  }
}
