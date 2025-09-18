import { IsEmail } from 'class-validator';
import { Recado } from 'src/entity/recados/entities/recado.entity';
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Pessoa {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  nome: string;

  @Column({ unique: true, length: 100 })
  @IsEmail()
  email: string;

  @Column({ length: 255 })
  passwordHash: string;

  @Column({ default: true })
  active: boolean;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;

  @Column({ default: ''})
  picture: string;

  /* virtual fields */
  @OneToMany(() => Recado, recado => recado.de)
  recadosEnviados: Recado[];

  @OneToMany(() => Recado, (recado) => recado.para)
  recadosRecebidos: Recado[];
}
