import {
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsEmail,
} from 'class-validator';

export class CreatePessoaDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  readonly nome: string;

  @IsEmail()
  @IsNotEmpty()
  readonly email: string; // e-mail será o usuário para login

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  readonly password: string; // sera convertida em hash antes de salvar no banco
}
