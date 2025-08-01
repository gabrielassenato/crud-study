import { IsString, MinLength, MaxLength, IsEmail, IsOptional } from "class-validator";

export class UpdatePessoaDto {
  @IsString()
  @IsOptional()
  @MinLength(2)
  @MaxLength(100)
  readonly nome?: string;

  @IsString()
  @IsOptional()
  @MinLength(6)
  readonly password?: string;
}
