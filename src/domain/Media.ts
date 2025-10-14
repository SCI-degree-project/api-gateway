import { ApiProperty } from "@nestjs/swagger";
import { GallertItem } from "./GalleryItem";

export class Media {
  @ApiProperty({ type: [GallertItem], example: ['image1.jpg', 'image2.jpg'] })
  gallery: GallertItem[];

  @ApiProperty({ example: 'model3d_url_example.com' })
  model: string;
}