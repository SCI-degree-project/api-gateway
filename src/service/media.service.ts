import { HttpService } from '@nestjs/axios';
import {
  Injectable,
  BadRequestException,
  UnsupportedMediaTypeException,
} from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import * as FormData from 'form-data';
import { ConfigService } from '@nestjs/config';
import { extname } from 'path';

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

  async uploadFile(file: Express.Multer.File): Promise<string> {
    const allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const allowedModelTypes = ['model/gltf-binary', 'application/octet-stream'];
    const allowedImageExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
    const allowedModelExtensions = ['.glb'];

    const mime = file.mimetype;
    const ext = extname(file.originalname).toLowerCase();

    const isImage = allowedImageTypes.includes(mime) && allowedImageExtensions.includes(ext);
    const isModel = allowedModelTypes.includes(mime) || allowedModelExtensions.includes(ext);

    if (!isImage && !isModel) {
      throw new UnsupportedMediaTypeException(`Unsupported file type: ${mime} (${ext})`);
    }

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

    if (!response.data?.url) {
      throw new BadRequestException('Media API did not return a URL');
    }

    return response.data.url;
  }
}
