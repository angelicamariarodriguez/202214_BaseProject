import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { TiendaDto } from '../tienda/tienda.dto';
import { TiendaEntity } from '../tienda/tienda.entity';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { TiendaProductoService } from './tienda-producto.service';

@Controller('products')
@UseInterceptors(BusinessErrorsInterceptor)
export class TiendaProductoController {
    constructor(private readonly tiendaProductoService: TiendaProductoService){}

    @Post(':productoId/stores/:tiendaId')
    async addStoreToProdcut(@Param('productoId') productoId: string, @Param('tiendaId') tiendaId: string){
       return await this.tiendaProductoService.addStoreToProduct(productoId, tiendaId);
    }

    @Get(':productoId/stores/:tiendaId')
    async findStoreFromProduct(@Param('productoId') productoId: string, @Param('tiendaId') tiendaId: string){
       return await this.tiendaProductoService.findStoreFromProduct(productoId, tiendaId);
    }

    @Get(':productoId/stores')
    async findStoresFromProduct(@Param('productoId') productoId: string){
       return await this.tiendaProductoService.findStoresFromProduct(productoId);
    }

    @Put(':productoId/stores')
   async updateStoresFromProduct(@Body() tiendasDto: TiendaDto[], @Param('productoId') productoId: string){
       const tiendas = plainToInstance(TiendaEntity, tiendasDto)
       return await this.tiendaProductoService.updateStoresFromProduct(productoId, tiendas);
   }

    @Delete(':productoId/stores/:tiendaId')
    @HttpCode(204)
    async deleteStoresFromProduct(@Param('productoId') productoId: string, @Param('tiendaId') tiendaId: string){
       return await this.tiendaProductoService.deleteStoreFromProduct(productoId, tiendaId);
    }
}
