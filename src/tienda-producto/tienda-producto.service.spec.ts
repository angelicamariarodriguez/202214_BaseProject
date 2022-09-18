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

  it('addStoreToProduct should add a store to a product', async () => {
    const newStore: TiendaEntity = await tiendaRepository.save({
      nombre: faker.company.name(),
      ciudad: 'BOG',
      direccion: faker.address.buildingNumber(),
    });

    const newProduct: ProductoEntity = await productoRepository.save({
      nombre: faker.company.name(),
      precio: faker.datatype.number(),
      tipo: 'Perecedero',
    });

    const result: ProductoEntity = await service.addStoreToProduct(
      newProduct.id,
      newStore.id,
    );

    expect(result.tiendas.length).toBe(1);
    expect(result.tiendas[0]).not.toBeNull();
    expect(result.tiendas[0].nombre).toBe(newStore.nombre);
    expect(result.tiendas[0].ciudad).toBe(newStore.ciudad);
    expect(result.tiendas[0].direccion).toBe(newStore.direccion);
  });

  it('addStoreToProduct should thrown exception for an invalid store', async () => {
    const newProduct: ProductoEntity = await productoRepository.save({
      nombre: faker.company.name(),
      precio: faker.datatype.number(),
      tipo: 'Perecedero',
    });

    await expect(() =>
      service.addStoreToProduct(newProduct.id, '0'),
    ).rejects.toHaveProperty('message', 'La tienda con el id dado no fue encontrada');
  });

  it('addStoreToProdcut should throw an exception for an invalid product', async () => {
    const newStore: TiendaEntity = await tiendaRepository.save({
      nombre: faker.company.name(),
      ciudad: 'BOG',
      direccion: faker.address.buildingNumber(),
    });

    await expect(() =>
      service.addStoreToProduct('0', newStore.id),
    ).rejects.toHaveProperty(
      'message',
      'El producto con el id dado no fue encontrado',
    );
  });

  it('findStoreFromProduct should return a store that has a product', async () => {
    const tienda: TiendaEntity = tiendasList[0];
    const storedTienda: TiendaEntity =
      await service.findStoreFromProduct(producto.id, tienda.id);
    expect(storedTienda).not.toBeNull();
    expect(storedTienda.nombre).toBe(tienda.nombre);
    expect(storedTienda.ciudad).toBe(tienda.ciudad);
    expect(storedTienda.direccion).toBe(tienda.direccion);
  });

  it('findStoreFromProduct should throw an exception for an invalid store', async () => {
    await expect(() =>
      service.findStoreFromProduct(producto.id, '0'),
    ).rejects.toHaveProperty('message', 'La tienda con el id dado no fue encontrada');
  });

  it('findStoreFromProduct should throw an exception for an invalid product', async () => {
    const tienda: TiendaEntity = tiendasList[0];
    await expect(() =>
      service.findStoreFromProduct('0', tienda.id),
    ).rejects.toHaveProperty(
      'message',
      'El producto con el id dado no fue encontrado',
    );
  });

  it('findStoreFromProduct should throw an exception for a store not associated to the product', async () => {
    const newTienda: TiendaEntity = await tiendaRepository.save({
      nombre: faker.company.name(),
      ciudad: 'BOG',
      direccion: faker.address.buildingNumber(),
    });

    await expect(() =>
      service.findStoreFromProduct(producto.id, newTienda.id),
    ).rejects.toHaveProperty(
      'message',
      'La tienda con el id dado no esta asociada al producto',
    );
  });

  it('findStoresFromProduct should return the stores that have a product', async () => {
    const tiendas: TiendaEntity[] = await service.findStoresFromProduct(
      producto.id,
    );
    expect(tiendas.length).toBe(5);
  });

  it('findStoresFromProduct should throw an exception for an invalid product', async () => {
    await expect(() =>
      service.findStoresFromProduct('0'),
    ).rejects.toHaveProperty(
      'message',
      'El producto con el id dado no fue encontrado',
    );
  });

  it('updateStoresFromProduct should update the stores that have a product', async () => {
    const newTienda: TiendaEntity = await tiendaRepository.save({
      nombre: faker.company.name(),
      ciudad: 'BOG',
      direccion: faker.address.buildingNumber(),
    });

    const updatedProducto: ProductoEntity = await service.updateStoresFromProduct(
      producto.id,
      [newTienda],
    );
    expect(updatedProducto.tiendas.length).toBe(1);
    expect(updatedProducto.tiendas[0].nombre).toBe(newTienda.nombre);
    expect(updatedProducto.tiendas[0].ciudad).toBe(newTienda.ciudad);
    expect(updatedProducto.tiendas[0].direccion).toBe(newTienda.direccion);
  });

  it('updateStoresFromProduct should throw an exception for an invalid product', async () => {
    const newTienda: TiendaEntity = await tiendaRepository.save({
      nombre: faker.company.name(),
      ciudad: 'BOG',
      direccion: faker.address.buildingNumber(),
    });

    await expect(() =>
      service.updateStoresFromProduct('0', [newTienda]),
    ).rejects.toHaveProperty(
      'message',
      'El producto con el id dado no fue encontrado',
    );
  });

  it('pdateStoresFromProduct should throw an exception for an invalid store', async () => {
    const newTienda: TiendaEntity = tiendasList[0];
    newTienda.id = '0';

    await expect(() =>
      service.updateStoresFromProduct(producto.id, [newTienda]),
    ).rejects.toHaveProperty('message', 'La tienda con el id dado no fue encontrada');
  });

  it('deleteStoreFromProduct should remove a store from a product', async () => {
    const tienda: TiendaEntity = tiendasList[0];

    await service.deleteStoreFromProduct(producto.id, tienda.id);

    const storedProducto: ProductoEntity = await productoRepository.findOne({
      where: { id: producto.id },
      relations: ['tiendas'],
    });
    const deletedTienda: TiendaEntity = storedProducto.tiendas.find(
      (a) => a.id === tienda.id,
    );

    expect(deletedTienda).toBeUndefined();
  });

  it('deleteStoreFromProduct should thrown an exception for an invalid store', async () => {
    await expect(() =>
      service.deleteStoreFromProduct(producto.id, '0'),
    ).rejects.toHaveProperty('message', 'La tienda con el id dado no fue encontrada');
  });


  it('deleteStoreFromProduct should thrown an exception for an invalid product', async () => {
    const tienda: TiendaEntity = tiendasList[0];
    await expect(() =>
      service.deleteStoreFromProduct('0', tienda.id),
    ).rejects.toHaveProperty(
      'message',
      'El producto con el id dado no fue encontrado',
    );
  });

  it('deleteStoreFromProduct should thrown an exception for an non asocciated store', async () => {
    const newTienda: TiendaEntity = await tiendaRepository.save({
      nombre: faker.company.name(),
      ciudad: 'BOG',
      direccion: faker.address.buildingNumber(),
    });

    await expect(() =>
      service.deleteStoreFromProduct(producto.id, newTienda.id),
    ).rejects.toHaveProperty(
      'message',
      'La tienda con el id dado no esta asociada al producto',
    );
  });

});
