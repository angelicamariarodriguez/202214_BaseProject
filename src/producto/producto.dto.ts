import { IsDate, IsNotEmpty, IsNumber, IsString, Matches } from 'class-validator';
export class ProductoDto {

  @IsString()
  @IsNotEmpty()
  readonly nombre: string;


  @IsNumber()
  @IsNotEmpty()
  readonly precio: number;

  @IsString()
  @IsNotEmpty()
  @Matches(/^Perecedero|No perecedero$/i, {message: 'Los tipos de productos permitidos son: Perecedero y No perecedero'})
  readonly tipo: string;
}