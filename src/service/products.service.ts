import { HttpService } from '@nestjs/axios';
import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable, firstValueFrom } from 'rxjs';

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
    return this.request(this.http.post(this.baseUrl, data));
  }

  async updateProduct(tenantId: string, productId: string, data: any) {
    return this.request(this.http.put(`${this.baseUrl}/${tenantId}/${productId}`, data));
  }

  async getProducts(tenantId: string, page: number, size: number) {
    return this.request(this.http.get(`${this.baseUrl}/${tenantId}`, { params: { page, size } }));
  }

  async getProductById(productId: string) {
    return this.request(this.http.get(`${this.baseUrl}/product/${productId}`));
  }

  async getProductsBatch(ids: string[]) {
    return this.request(this.http.post(`${this.baseUrl}/batch`, ids));
  }

  private async request<T>(observable: Observable<any>): Promise<T> {
    try {
      const response = await firstValueFrom(observable);
      return response.data;
    } catch (error) {
      const status = error.response?.status || 500;
      const message =
        error.response?.data?.message || error.response?.data || 'Internal error';
      throw new HttpException(message, status);
    }
  }

  async patchProduct(tenantId: string, productId: string, dto: any) {
    return this.request(
      this.http.patch(`${this.baseUrl}/${tenantId}/${productId}`, dto)
    );
  }

  async searchProducts(criteria: any) {
    return this.request(
      this.http.post(`${this.baseUrl}/search`, criteria)
    );
  }
}
