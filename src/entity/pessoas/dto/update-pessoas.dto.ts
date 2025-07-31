import { IsString, IsNotEmpty, MinLength, MaxLength, IsEmail } from "class-validator";

export class UpdatePessoaDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  readonly nome?: string;

  @IsEmail()
  @IsNotEmpty()
  readonly email?: string;
}
