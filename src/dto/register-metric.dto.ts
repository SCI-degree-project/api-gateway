import { ApiProperty } from "@nestjs/swagger";
import { MetricType } from "src/domain/MetricType";

export class RegisterMetricDto {
  @ApiProperty({ example: 'CLICK' })
  metric: MetricType;
}
