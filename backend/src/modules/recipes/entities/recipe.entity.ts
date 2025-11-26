import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Category } from '../../categories/entities/category.entity';

@Entity('receitas')
export class Recipe {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column({ name: 'id_usuarios', type: 'int', unsigned: true })
  usuarioId: number;

  @Column({
    name: 'id_categorias',
    type: 'int',
    unsigned: true,
    nullable: true,
  })
  categoriaId: number;

  @Column({ type: 'varchar', length: 45, nullable: true })
  nome: string;

  @Column({
    name: 'tempo_preparo_minutos',
    type: 'int',
    unsigned: true,
    nullable: true,
  })
  tempoPreparoMinutos: number;

  @Column({ type: 'int', unsigned: true, nullable: true })
  porcoes: number;

  @Column({ name: 'modo_preparo', type: 'text' })
  modoPreparo: string;

  @Column({ type: 'text', nullable: true })
  ingredientes: string;

  @CreateDateColumn({ name: 'criado_em' })
  criadoEm: Date;

  @UpdateDateColumn({ name: 'alterado_em' })
  alteradoEm: Date;

  @ManyToOne(() => User, (user) => user.receitas, {
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'id_usuarios' })
  usuario: User;

  @ManyToOne(() => Category, (category) => category.receitas, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'id_categorias' })
  categoria: Category;
}
