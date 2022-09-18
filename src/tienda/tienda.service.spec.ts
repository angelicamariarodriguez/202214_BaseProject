import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { TiendaService } from './Tienda.service';
import { TiendaEntity } from './Tienda.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('TiendaService', () => {
  let service: TiendaService;
  let repository: Repository<TiendaEntity>;
  let tiendasList: TiendaEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [TiendaService],
    }).compile();

    service = module.get<TiendaService>(TiendaService);
    repository = module.get<Repository<TiendaEntity>>(getRepositoryToken(TiendaEntity));

    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    tiendasList = [];
    for (let i = 0; i < 5; i++) {
      const tienda: TiendaEntity = await repository.save({
        nombre: faker.company.name(),
        ciudad: 'BOG',
        direccion: faker.address.buildingNumber(),
      });
      tiendasList.push(tienda);
    }
    };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all stores', async () => {
    const tienda: TiendaEntity[] = await service.findAll();
    expect(tienda).not.toBeNull();
    expect(tienda).toHaveLength(tiendasList.length);
    });

    it('findOne should return a store by id', async () => {
      const storedStore: TiendaEntity = tiendasList[0];
      const tienda: TiendaEntity = await service.findOne(storedStore.id);
      expect(tienda).not.toBeNull();
      expect(tienda.nombre).toEqual(storedStore.nombre);
      expect(tienda.ciudad).toEqual(storedStore.ciudad);
      expect(tienda.direccion).toEqual(storedStore.direccion);
    });

    it('findOne should throw an exception for an invalid store', async () => {
      await expect(() => service.findOne('0')).rejects.toHaveProperty(
        'message',
        'La tienda con el id dado no fue encontrada',
      );
    });

    it('create should return a new store', async () => {
  
      const cd = {
        id: '',
        nombre: faker.company.name(),
        ciudad: 'BOG',
        direccion: faker.address.buildingNumber(),
        productos: []
      };
  
      const newStore: TiendaEntity = await service.create(cd);
      expect(newStore).not.toBeNull();
  
      const storedStore: TiendaEntity = await repository.findOne({
        where: { id: newStore.id },
      });
      expect(storedStore).not.toBeNull();
      expect(storedStore.nombre).toEqual(newStore.nombre);
      expect(storedStore.ciudad).toEqual(newStore.ciudad);
      expect(storedStore.direccion).toEqual(newStore.direccion);
    });

    it('update should modify a store', async () => {
      const tienda: TiendaEntity = tiendasList[0];
      tienda.nombre = 'New name';
      tienda.ciudad = 'CAR';
      const updatedTienda: TiendaEntity = await service.update(
        tienda.id,
        tienda,
      );
      expect(updatedTienda).not.toBeNull();
      const storedStore: TiendaEntity = await repository.findOne({
        where: { id: tienda.id },
      });
      expect(storedStore).not.toBeNull();
      expect(storedStore.nombre).toEqual(tienda.nombre);
      expect(storedStore.ciudad).toEqual(tienda.ciudad);
    });

    it('update should throw an exception for an invalid store', async () => {
      let tienda: TiendaEntity = tiendasList[0];
      tienda = {
        ...tienda, nombre: "New name", ciudad: 'CAR'
      }
      await expect(() => service.update("0", tienda)).rejects.toHaveProperty(
        "message", "La tienda con el id dado no fue encontrada")
    });

    it('delete should remove a store', async () => {
      const tienda: TiendaEntity = tiendasList[0];
      await service.delete(tienda.id);
      const deletedTienda: TiendaEntity = await repository.findOne({
        where: { id: tienda.id },
      });
      expect(deletedTienda).toBeNull();
    });

    it('delete should throw an exception for an invalid store', async () => {
      const tienda: TiendaEntity = tiendasList[0];
      await service.delete(tienda.id);
      await expect(() => service.delete('0')).rejects.toHaveProperty(
        'message',
        'La tienda con el id dado no fue encontrada'
      );
    });
  
});
  
