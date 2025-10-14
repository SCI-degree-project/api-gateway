import { ApiProperty } from "@nestjs/swagger";

export class Dimensions {
  @ApiProperty({ example: 120 })
  width: number;

  @ApiProperty({ example: 80 })
  height: number;

  @ApiProperty({ example: 60 })
  depth: number;
}