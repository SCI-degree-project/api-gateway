import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateStoreDto {
  @ApiPropertyOptional()
  name?: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiPropertyOptional()
  address?: string;

  @ApiPropertyOptional()
  phone?: string;

  @ApiPropertyOptional()
  facebookURL?: string;

  @ApiPropertyOptional()
  instagramURL?: string;

  @ApiPropertyOptional()
  tiktokURL?: string;
}
