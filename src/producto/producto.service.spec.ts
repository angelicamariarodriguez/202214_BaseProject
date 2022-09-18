import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { ProductoService } from './producto.service';
import { ProductoEntity } from './producto.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('ProductoService', () => {
  let service: ProductoService;
  let repository: Repository<ProductoEntity>;
  let productosList: ProductoEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ProductoService],
    }).compile();

    service = module.get<ProductoService>(ProductoService);
    repository = module.get<Repository<ProductoEntity>>(getRepositoryToken(ProductoEntity));

    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    productosList = [];
    for (let i = 0; i < 5; i++) {
      const producto: ProductoEntity = await repository.save({
        nombre: faker.company.name(),
        precio: faker.datatype.number(),
        tipo: 'Perecedero',
      });
      productosList.push(producto);
    }
    };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all products', async () => {
    const producto: ProductoEntity[] = await service.findAll();
    expect(producto).not.toBeNull();
    expect(producto).toHaveLength(productosList.length);
    });

    it('findOne should return a product by id', async () => {
      const storedProduct: ProductoEntity = productosList[0];
      const prodcuto: ProductoEntity = await service.findOne(storedProduct.id);
      expect(prodcuto).not.toBeNull();
      expect(prodcuto.nombre).toEqual(storedProduct.nombre);
      expect(prodcuto.precio).toEqual(storedProduct.precio);
      expect(prodcuto.tipo).toEqual(storedProduct.tipo);
    });

    it('findOne should throw an exception for an invalid product', async () => {
      await expect(() => service.findOne('0')).rejects.toHaveProperty(
        'message',
        'El producto con el id dado no fue encontrado',
      );
    });

    it('create should return a new product', async () => {
  
      const cd = {
        id: '',
        nombre: faker.company.name(),
        precio: faker.datatype.number(),
        tipo: 'Perecedero',
        tiendas: []
      };
  
      const newProduct: ProductoEntity = await service.create(cd);
      expect(newProduct).not.toBeNull();
  
      const storedProduct: ProductoEntity = await repository.findOne({
        where: { id: newProduct.id },
      });
      expect(storedProduct).not.toBeNull();
      expect(storedProduct.nombre).toEqual(newProduct.nombre);
      expect(storedProduct.precio).toEqual(newProduct.precio);
      expect(storedProduct.tipo).toEqual(newProduct.tipo);
    });

    it('update should modify a product', async () => {
      const producto: ProductoEntity = productosList[0];
      producto.nombre = 'New name';
      producto.precio = 500;
      const updatedProducto: ProductoEntity = await service.update(
        producto.id,
        producto,
      );
      expect(updatedProducto).not.toBeNull();
      const storedProduct: ProductoEntity = await repository.findOne({
        where: { id: producto.id },
      });
      expect(storedProduct).not.toBeNull();
      expect(storedProduct.nombre).toEqual(producto.nombre);
      expect(storedProduct.precio).toEqual(producto.precio);
    });

    it('update should throw an exception for an invalid product', async () => {
      let producto: ProductoEntity = productosList[0];
      producto = {
        ...producto, nombre: "New name", precio: 500
      }
      await expect(() => service.update("0", producto)).rejects.toHaveProperty(
        "message", "El producto con el id dado no fue encontrado")
    });

    it('delete should remove a product', async () => {
      const prodcuto: ProductoEntity = productosList[0];
      await service.delete(prodcuto.id);
      const deletedProducto: ProductoEntity = await repository.findOne({
        where: { id: prodcuto.id },
      });
      expect(deletedProducto).toBeNull();
    });

    it('delete should throw an exception for an invalid product', async () => {
      const producto: ProductoEntity = productosList[0];
      await service.delete(producto.id);
      await expect(() => service.delete('0')).rejects.toHaveProperty(
        'message',
        'El producto con el id dado no fue encontrado'
      );
    });
  
});
  
