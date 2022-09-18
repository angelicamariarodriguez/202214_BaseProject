import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductoEntity } from './producto/producto.entity';
import { ProductoModule } from './producto/producto.module';
import { TiendaEntity } from './tienda/tienda.entity';
import { TiendaModule } from './tienda/tienda.module';

@Module({
  imports: [TiendaModule, ProductoModule, 
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'tiendas',
      entities: [TiendaEntity, ProductoEntity],
      dropSchema: true,
      synchronize: true,
      keepConnectionAlive: true
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
 })
 export class AppModule {}
