import { ApiPropertyOptional } from '@nestjs/swagger';

export class ProductSearchCriteriaDto {
  @ApiPropertyOptional({ example: 'sofa' })
  name?: string;

  @ApiPropertyOptional({ example: 'MODERN' })
  style?: string;

  @ApiPropertyOptional({ type: [String], example: ['WOOD', 'FABRIC'] })
  materials?: string[];

  @ApiPropertyOptional({ example: 'name' })
  sortBy?: string;

  @ApiPropertyOptional({ example: 'asc', enum: ['asc', 'desc'] })
  direction?: string;

  @ApiPropertyOptional({ example: 0 })
  page?: number;

  @ApiPropertyOptional({ example: 20 })
  size?: number;
}
