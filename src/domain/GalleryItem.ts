import { ApiProperty } from "@nestjs/swagger";

export class GallertItem {
  @ApiProperty({ example: 'image1.jpg' })
  imageUrl: string;

  @ApiProperty({ example: "name" })
  altText: string;
}