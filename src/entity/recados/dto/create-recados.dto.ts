import { IsNotEmpty, IsPositive, IsString, MaxLength, MinLength } from "class-validator";

// são as coisas que vamos receber para criar um recado
export class CreateRecadoDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(5)
    @MaxLength(255)
    readonly texto: string;

    @IsPositive()
    paraId: number;
}