import { HttpService } from '@nestjs/axios';
import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable, firstValueFrom } from 'rxjs';

@Injectable()
export class StoreService {
  private baseUrl: string;

  constructor(
    private readonly http: HttpService,
    private readonly configService: ConfigService,
  ) {
    const url = this.configService.get<string>('AUTH_API_URL');
    if (!url) {
      throw new Error('AUTH_API_URL is not defined in environment variables');
    }
    this.baseUrl = `${url}/stores`;
  }

  async getById(storeId: string) {
    return this.request(this.http.get(`${this.baseUrl}/${storeId}`));
  }

  async update(storeId: string, data: any) {
    return this.request(this.http.patch(`${this.baseUrl}/${storeId}`, data));
  }

  async delete(productId: string) {
    return this.request(
      this.http.delete(`${this.baseUrl}/${productId}`)
    )
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
}
