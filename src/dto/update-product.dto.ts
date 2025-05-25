import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateProductDto {
  @ApiPropertyOptional()
  name?: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiPropertyOptional()
  price?: number;

  @ApiPropertyOptional({ type: [String] })
  materials?: string[];

  @ApiPropertyOptional()
  style?: string;

  @ApiPropertyOptional()
  model?: string;

  @ApiPropertyOptional({ type: [String] })
  gallery?: string[];
}
