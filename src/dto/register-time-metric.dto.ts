import { ApiProperty } from "@nestjs/swagger";
import { TimeMetricType } from "src/domain/TimeMetricType";

export class RegisterTimeMetricDto {
  @ApiProperty({ example: 'TIME_ON_PAGE' })
  metric: TimeMetricType;

  @ApiProperty({ example: '23.7' })
  duration: Float32Array;
}
