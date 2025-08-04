import { Pessoa } from 'src/entity/pessoas/entities/pessoa.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
@Entity()
export class Recado {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  texto: string;

  @Column({ type: 'boolean', default: false })
  lido: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  /* virtual fields */
  @ManyToOne(() => Pessoa, { onDelete: 'CASCADE', onUpdate: 'CASCADE' }) // quando a pessoa for deletada, o recado também será deletado
  @JoinColumn({ name: 'de'})
  de: Pessoa;

  @ManyToOne(() => Pessoa, { onDelete: 'CASCADE', onUpdate: 'CASCADE' }) // quando a pessoa for deletada, o recado também será deletado
  @JoinColumn({ name: 'para' })
  para: Pessoa;
}
