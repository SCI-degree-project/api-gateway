import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ProductsService {
  constructor(private readonly http: HttpService) {}

  async createProduct(data: any) {
    const response = await firstValueFrom(
      this.http.post('http://localhost:8080/v1/products', data)
    );
    return response.data;
  }
}
