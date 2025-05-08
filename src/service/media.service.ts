import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import * as FormData from 'form-data';

@Injectable()
export class MediaService {
  constructor(private readonly http: HttpService) {}

  async uploadImage(file: Express.Multer.File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file.buffer, {
      filename: file.originalname,
      contentType: file.mimetype,
    });

    const response = await firstValueFrom(
      this.http.post('http://localhost:3000/media/upload', formData, {
        headers: formData.getHeaders(),
        maxBodyLength: Infinity,
      }),
    );

    return response.data.url;
  }
}

