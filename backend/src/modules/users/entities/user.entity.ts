import { Entity, Column, OneToMany } from 'typeorm';
import { Exclude } from 'class-transformer';
import { Recipe } from '../../recipes/entities/recipe.entity';
import { BaseEntity } from '../../../common/entities/base.entity';

@Entity('usuarios')
export class User extends BaseEntity {
  @Column({ type: 'varchar', length: 100, nullable: true })
  nome: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  login: string;

  @Column({ name: 'senha', type: 'varchar', length: 100 })
  @Exclude()
  senha: string;

  @OneToMany(() => Recipe, (recipe) => recipe.usuario)
  receitas: Recipe[];

  constructor(partial: Partial<User>) {
    super();
    Object.assign(this, partial);
  }
}
