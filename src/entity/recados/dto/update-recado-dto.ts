import { PartialType } from "@nestjs/mapped-types";
import { IsBoolean, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator";
import { CreateRecadoDto } from "./create-recados.dto";

// são as coisas que vamos receber para EDITAR um recado, nesse caso usando o partial type teremos os mesmos campos do CreateRecadoDto, mas todos eles são opcionais
export class UpdateRecadoDto extends PartialType(CreateRecadoDto) {/*se eu adicionar algo aqui sobreescreve*/

    // também por hora posso adicionar novos campos
    @IsBoolean()
    @IsOptional()
    readonly lido?: boolean;

    // @IsString()
    // @IsNotEmpty()
    // @MinLength(5)
    // @MaxLength(255)
    // readonly texto: string;

    // @IsString()
    // @IsNotEmpty()
    // @MinLength(2)
    // @MaxLength(50)
    // readonly de: string;

    // @IsString()
    // @IsNotEmpty()
    // @MinLength(2)
    // @MaxLength(50)
    // readonly para: string;
}