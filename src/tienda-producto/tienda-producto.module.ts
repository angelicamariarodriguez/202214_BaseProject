import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductoEntity } from '../producto/producto.entity';
import { TiendaEntity } from '../tienda/tienda.entity';
import { TiendaProductoService } from './tienda-producto.service';

@Module({
  imports: [TypeOrmModule.forFeature([TiendaEntity, ProductoEntity])],
  providers: [TiendaProductoService]
})
export class TiendaProductoModule {}
