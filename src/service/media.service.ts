import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import * as FormData from 'form-data';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MediaService {
    private baseUrl: string;
  
    constructor(
      private readonly http: HttpService,
      private readonly configService: ConfigService,
    ) {
      const baseUrl = this.configService.get<string>('MEDIA_API_URL');
      if (!baseUrl) {
        throw new Error('MEDIA_API_URL is not defined in environment variables');
      }
      this.baseUrl = baseUrl;
  
    }

  async uploadImage(file: Express.Multer.File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file.buffer, {
      filename: file.originalname,
      contentType: file.mimetype,
    });

    const response = await firstValueFrom(
      this.http.post(`${this.baseUrl}/media/upload`, formData, {
        headers: formData.getHeaders(),
        maxBodyLength: Infinity,
      }),
    );

    return response.data.url;
  }
}

