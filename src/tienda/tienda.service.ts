import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { TiendaEntity } from './tienda.entity';

@Injectable()
export class TiendaService {
    constructor(
        @InjectRepository(TiendaEntity)
        private readonly tiendaRepository: Repository<TiendaEntity>
    ){}

    async findAll(): Promise<TiendaEntity[]> {
        return await this.tiendaRepository.find({ relations: ["productos"] });
    }

    async findOne(id: string): Promise<TiendaEntity> {
        const tienda: TiendaEntity = await this.tiendaRepository.findOne({where: {id}, relations: ["productos"] } );
        if (!tienda)
          throw new BusinessLogicException("La tienda con el id dado no fue encontrada", BusinessError.NOT_FOUND);
   
        return tienda;
    }

    async create(tienda: TiendaEntity): Promise<TiendaEntity> {
        if(tienda.ciudad.length> 3)
            throw new BusinessLogicException("La ciudad debe ser un codigo de tres caracteres, ejemplo: BOG", BusinessError.PRECONDITION_FAILED);
        else
            return await this.tiendaRepository.save(tienda);
    }

    async update(id: string, tienda: TiendaEntity): Promise<TiendaEntity> {
        const persistedTienda: TiendaEntity = await this.tiendaRepository.findOne({where:{id}});
        if (!persistedTienda)
          throw new BusinessLogicException("La tienda con el id dado no fue encontrada", BusinessError.NOT_FOUND);
        
        if(tienda.ciudad.length> 3)
          throw new BusinessLogicException("La ciudad debe ser un codigo de tres caracteres, ejemplo: BOG", BusinessError.PRECONDITION_FAILED);
       
        else   
          return await this.tiendaRepository.save({...persistedTienda, ...tienda});
    }

    async delete(id: string) {
        const tienda: TiendaEntity = await this.tiendaRepository.findOne({where:{id}});
        if (!tienda)
          throw new BusinessLogicException("La tienda con el id dado no fue encontrada", BusinessError.NOT_FOUND);
     
        await this.tiendaRepository.remove(tienda);
    }
}
