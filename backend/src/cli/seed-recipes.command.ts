import { Command, CommandRunner, Option } from 'nest-commander';
import { DataSource } from 'typeorm';
import { Recipe } from '../modules/recipes/entities/recipe.entity';
import { Category } from '../modules/categories/entities/category.entity';
import { User } from '../modules/users/entities/user.entity';

/**
 * Para Realizar a geração aleatória de receitas basta executar
 * npm run cli -- seed:recipes -c <numero de elementos>
 * Exemplo: npm run cli -- seed:recipes -c 100
 */

interface SeedRecipesOptions {
  count?: number;
}

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pickRandom<T>(arr: T[]): T {
  return arr[randInt(0, arr.length - 1)];
}

function generateNome(): string {
  const adjetivos = [
    'Clássica',
    'Rápida',
    'Deliciosa',
    'Caseira',
    'Especial',
    'Refrescante',
    'Crocante',
  ];
  const base = [
    'Salada',
    'Sopa',
    'Massa',
    'Bolo',
    'Torta',
    'Sanduíche',
    'Suco',
    'Frango',
    'Carne',
    'Peixe',
  ];
  return `${pickRandom(adjetivos)} ${pickRandom(base)}`.slice(0, 45);
}

function generateModoPreparo(): string {
  const passos = [
    'Preaqueça o forno a 180°C.',
    'Misture os ingredientes em uma tigela.',
    'Refogue em fogo médio por 10 minutos.',
    'Cozinhe até ficar macio.',
    'Bata no liquidificador até homogeneizar.',
    'Leve à geladeira por 30 minutos.',
    'Asse por 40 minutos ou até dourar.',
  ];
  const count = randInt(3, 6);
  const selecionados: string[] = [];
  for (let i = 0; i < count; i++) selecionados.push(pickRandom(passos));
  return selecionados.join(' ');
}

function generateIngredientes(): string {
  const itens = [
    'farinha de trigo',
    'açúcar',
    'sal',
    'óleo',
    'manteiga',
    'leite',
    'ovos',
    'tomate',
    'cebola',
    'alho',
    'frango',
    'carne moída',
    'queijo',
    'orégano',
    'pimenta-do-reino',
    'manjericão',
  ];
  const count = randInt(4, 10);
  const selecionados: string[] = [];
  for (let i = 0; i < count; i++) selecionados.push(pickRandom(itens));
  return selecionados.join(', ');
}

@Command({
  name: 'seed:recipes',
  description: 'Gerar receitas de seed',
  arguments: '[count]',
})
export class SeedRecipesCommand extends CommandRunner {
  constructor(private readonly dataSource: DataSource) {
    super();
  }

  @Option({
    flags: '-c, --count <number>',
    description: 'Quantidade de receitas',
  })
  parseCount(val: string): number {
    const n = parseInt(val, 10);
    return Number.isNaN(n) || n <= 0 ? 1 : n;
  }

  async run(
    passedParam: string[],
    options?: SeedRecipesOptions,
  ): Promise<void> {
    const countPos =
      passedParam && passedParam[0] ? parseInt(passedParam[0], 10) : undefined;
    const count =
      options?.count ?? (Number.isNaN(countPos!) ? undefined : countPos) ?? 1;
    const recipeRepo = this.dataSource.getRepository(Recipe);
    const userRepo = this.dataSource.getRepository(User);
    const categoryRepo = this.dataSource.getRepository(Category);

    const users = await userRepo.find();
    if (users.length === 0)
      throw new Error('Nenhum usuário encontrado para vincular receitas');
    const categories = await categoryRepo.find();

    const createdIds: number[] = [];
    for (let i = 0; i < count; i++) {
      const usuario = pickRandom(users);
      const categoria = categories.length ? pickRandom(categories) : null;
      const entity = recipeRepo.create({
        usuarioId: usuario.id,
        categoriaId: categoria ? categoria.id : null,
        nome: generateNome(),
        tempoPreparoMinutos: randInt(5, 180),
        porcoes: randInt(1, 12),
        modoPreparo: generateModoPreparo(),
        ingredientes: generateIngredientes(),
      });
      const saved = await recipeRepo.save(entity);
      createdIds.push(saved.id);
    }
    console.log(`Receitas criadas: ${createdIds.join(', ')}`);
  }
}
