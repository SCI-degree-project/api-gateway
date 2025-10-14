import { ApiPropertyOptional } from '@nestjs/swagger';
import { Dimensions } from 'src/domain/Dimensions';
import { Media } from 'src/domain/Media';

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

  @ApiPropertyOptional({ type: () => Media })
    media: Media;
  
    @ApiPropertyOptional({ type: () => Dimensions })
    dimensions: Dimensions;
}
