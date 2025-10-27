import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { AxiosError } from 'axios';
import { MetricType } from 'src/domain/MetricType';
import { RegisterTimeMetricDto } from 'src/dto/register-time-metric.dto';
import { RegisterMetricDto } from 'src/dto/register-metric.dto';

@Injectable()
export class MetricsService {
    private readonly baseUrl: string;

    constructor(
        private readonly http: HttpService,
        private readonly configService: ConfigService,
    ) {
        const url = this.configService.get<string>('PRODUCTS_API_URL');
        if (!url) {
            throw new Error('PRODUCTS_API_URL is not defined in environment variables');
        }
        this.baseUrl = `${url}/v1/metrics`;
    }

    async getProductMetric(productId: string): Promise<any> {
        const response = await firstValueFrom(
            this.http.get(`${this.baseUrl}/${productId}`),
        );
        return response.data;
    }

    async registerMetric(productId: string, metric: RegisterMetricDto): Promise<void> {
        await firstValueFrom(
            this.http.post(`${this.baseUrl}/register/${productId}`, metric),
        );
    }

    async registerTimeMetric(productId: string, data: RegisterTimeMetricDto): Promise<void> {
        await firstValueFrom(
            this.http.post(`${this.baseUrl}/register-time/${productId}`, data),
        );
    }

    async getTenantMetricsReport(tenantId: string): Promise<any> {
        const response = await firstValueFrom(
            this.http.get(`${this.baseUrl}/report/${tenantId}`)
        );
        return response.data;
    }

    mapError(error: any): number {
        if (error?.response?.status) {
            return error.response.status;
        }
        if (error instanceof AxiosError) {
            return error.response?.status || 500;
        }
        return 500;
    }
}
