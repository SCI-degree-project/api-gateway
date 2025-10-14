import {
    Controller,
    Get,
    Body,
    Param,
    Patch,
    Delete,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBody } from '@nestjs/swagger';
import { StoreService } from 'src/service/store.service';
import { UpdateStoreDto } from 'src/dto/update-store.dto';

@ApiTags('Stores')
@Controller('stores')
export class StoreController {
    constructor(
        private readonly storeService: StoreService,
    ) { }

    @Get(':storeId')
    @ApiOperation({ summary: 'Get a store by Id' })
    @ApiParam({ name: 'storeId', type: String })
    async getById(@Param('storeId') storeId: string) {
        return this.storeService.getById(storeId);
    }

    @Patch('/:productId')
    @ApiOperation({ summary: 'Update a store with new values' })
    @ApiParam({ name: 'storeId', type: String })
    @ApiBody({ type: UpdateStoreDto })
    async update(@Param('storeId') storeId: string, @Body() body: UpdateStoreDto) {
        const productPayload: any = {};

        if (body.name !== undefined) productPayload.name = body.name;
        if (body.description !== undefined) productPayload.name = body.description;
        if (body.address !== undefined) productPayload.name = body.address;
        if (body.phone !== undefined) productPayload.name = body.phone;
        if (body.facebookURL !== undefined) productPayload.name = body.facebookURL;
        if (body.instagramURL !== undefined) productPayload.name = body.instagramURL;
        if (body.tiktokURL !== undefined) productPayload.name = body.tiktokURL;

        return this.storeService.update(storeId, productPayload);
    }

    @Delete(':productId')
    @ApiOperation({ summary: 'Delete a store' })
    @ApiParam({ name: 'storeId', type: String })
    async deleteProduct(@Param('productId') storeId: string,) {
        return this.storeService.delete(storeId);
    }
}
