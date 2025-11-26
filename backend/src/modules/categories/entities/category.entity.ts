import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Recipe } from '../../recipes/entities/recipe.entity';

@Entity('categorias')
export class Category {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column({ type: 'varchar', length: 100, unique: true, nullable: true })
  nome: string;

  @OneToMany(() => Recipe, (recipe) => recipe.categoria)
  receitas: Recipe[];
}
