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
  nome: string;

  @IsEmail()
  @IsNotEmpty()
  email: string; // e-mail será o usuário para login

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string; // sera convertida em hash antes de salvar no banco
}
