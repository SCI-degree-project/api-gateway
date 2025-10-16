import { ApiProperty } from "@nestjs/swagger";

export class Dimensions {
  @ApiProperty({ example: 120 })
  width: string;
  @ApiProperty({ example: 80 })
  height: string;
  @ApiProperty({ example: 60 })
  depth: string;
}