import { Test, TestingModule } from '@nestjs/testing';
import { ProductoEntity } from '../producto/producto.entity';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { TiendaProductoService } from './tienda-producto.service';
import { TiendaEntity } from '../tienda/tienda.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('TiendaProductoService', () => {
  let service: TiendaProductoService;
  let productoRepository: Repository<ProductoEntity>;
  let tiendaRepository: Repository<TiendaEntity>;
  let producto: ProductoEntity;
  let tiendasList : TiendaEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [TiendaProductoService],
    }).compile();

    service = module.get<TiendaProductoService>(TiendaProductoService);
    productoRepository = module.get<Repository<ProductoEntity>>(getRepositoryToken(ProductoEntity));
    tiendaRepository = module.get<Repository<TiendaEntity>>(getRepositoryToken(TiendaEntity));

    await seedDatabase();
  });

  const seedDatabase = async () => {
    tiendaRepository.clear();
    productoRepository.clear();

    tiendasList = [];
    for(let i = 0; i < 5; i++){
        const tienda: TiendaEntity = await tiendaRepository.save({
          nombre: faker.company.name(),
          ciudad: 'BOG',
          direccion: faker.address.buildingNumber(),
        })
        tiendasList.push(tienda);
    }

    producto = await productoRepository.save({
      nombre: faker.company.name(),
      precio: faker.datatype.number(),
      tipo: 'Perecedero',
      tiendas: tiendasList,
    })
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
