import {
    Controller,
    Get,
    Param,
    Post,
    Res,
    HttpStatus,
    Body,
} from '@nestjs/common';
import { MetricsService } from 'src/service/metrics.service';
import { Response } from 'express';
import { MetricType } from 'src/domain/MetricType';
import { RegisterTimeMetricDto } from 'src/dto/register-time-metric.dto';
import { RegisterMetricDto } from 'src/dto/register-metric.dto';

@Controller('/metrics')
export class MetricsController {
    constructor(private readonly metricsService: MetricsService) { }

    @Get(':productId')
    async getProductMetric(@Param('productId') productId: string, @Res() res: Response) {
        try {
            const metric = await this.metricsService.getProductMetric(productId);
            return res.status(HttpStatus.OK).json(metric);
        } catch (error) {
            return res.status(this.metricsService.mapError(error)).send();
        }
    }

    @Post('register/:productId')
    async registerMetric(
        @Param('productId') productId: string, 
        @Body() metric: RegisterMetricDto, 
        @Res() res: Response
    ) {
        try {
            await this.metricsService.registerMetric(productId, metric);
            return res.status(HttpStatus.OK).send();
        } catch (error) {
            return res.status(this.metricsService.mapError(error)).send();
        }
    }

    @Post('register-time/:productId')
    async registerTimeMetric(
        @Param('productId') productId: string,
        @Body() body: RegisterTimeMetricDto,
        @Res() res: Response
    ) {  
        try {
            await this.metricsService.registerTimeMetric(productId, body);
            return res.status(HttpStatus.OK).send();
        } catch (error) {
            return res.status(this.metricsService.mapError(error)).send();
        }
    }

    @Get('report/:tenantId')
    async getTenantReport(@Param('tenantId') tenantId: string, @Res() res: Response) {
        try {
            const report = await this.metricsService.getTenantMetricsReport(tenantId);
            return res.status(HttpStatus.OK).json(report);
        } catch (error) {
            return res.status(this.metricsService.mapError(error)).send();
        }
    }
}
