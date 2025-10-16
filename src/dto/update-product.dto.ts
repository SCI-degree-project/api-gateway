import { ApiPropertyOptional } from '@nestjs/swagger';
import { Dimensions } from 'src/domain/Dimensions';

export class UpdateProductDto {
  @ApiPropertyOptional({ example: 'Modern Chair' })
  name: string;

  @ApiPropertyOptional({ example: 'Modern chair for your room...' })
  description: string;

  @ApiPropertyOptional({ example: 300 })
  price: string;

  @ApiPropertyOptional({ type: [String], example: ['WOOD'] })
  materials: String[];

  @ApiPropertyOptional({ example: 'MODERN' })
  style: string;

  @ApiPropertyOptional({ example: '3fa85f64-5717-4562-b3fc-2c963f66afa6' })
  tenantId: string;

  @ApiPropertyOptional({ type: () => Dimensions })
  dimensions: Dimensions;

  @ApiPropertyOptional()
  model?: string;

  @ApiPropertyOptional({ type: [String] })
  gallery?: string[];
}
