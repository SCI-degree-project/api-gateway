import {
    Controller,
    Get,
    Param,
    Post,
    Res,
    HttpStatus,
} from '@nestjs/common';
import { MetricsService } from 'src/service/metrics.service';
import { Response } from 'express';

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

    @Post('click/:productId')
    async registerClick(@Param('productId') productId: string, @Res() res: Response) {
        try {
            await this.metricsService.registerClick(productId);
            return res.status(HttpStatus.OK).send();
        } catch (error) {
            return res.status(this.metricsService.mapError(error)).send();
        }
    }

    @Post('ar-views/:productId')
    async registerArView(@Param('productId') productId: string, @Res() res: Response) {
        try {
            await this.metricsService.registerArView(productId);
            return res.status(HttpStatus.OK).send();
        } catch (error) {
            return res.status(this.metricsService.mapError(error)).send();
        }
    }

    @Post('search-appearances/:productId')
    async registerSearchAppearance(@Param('productId') productId: string, @Res() res: Response) {
        try {
            await this.metricsService.registerSearchAppearance(productId);
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
