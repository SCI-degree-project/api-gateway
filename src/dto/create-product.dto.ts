import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({ example: 'Modern Chair' })
  name: string;

  @ApiProperty({ example: 'Modern chaair for your room...' })
  description: string;

  @ApiProperty({ example: 299.99 })
  price: number;

  @ApiProperty({ type: [String], example: ['WOOD', 'LEATHER'] })
  materials: string[];

  @ApiProperty({ example: 'MODERN' })
  style: string;

  @ApiProperty({ example: '3fa85f64-5717-4562-b3fc-2c963f66afa6' })
  tenantId: string;

  @ApiProperty({ type: [String], example: ['', ''] })
  gallery: string;

  @ApiProperty({ example: '' })
  model: string;
}
