import { IsDate, IsNotEmpty, IsNumber, IsString, Matches } from 'class-validator';
export class TiendaDto {

  @IsString()
  @IsNotEmpty()
  readonly nombre: string;

  @IsString()
  @IsNotEmpty()
  readonly ciudad: string;

  @IsString()
  @IsNotEmpty()
  readonly direccion: string;
 
}