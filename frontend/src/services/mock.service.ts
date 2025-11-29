import type { Recipe } from '@/types/recipe.types'
import type { Category } from '@/types/category.types'
import type { DefaultResponse, DefaultPaginationResponse } from '@/types/auth.types'

// Dados mockados para demonstração
const mockCategories: Category[] = [
  { id: 1, nome: 'Sobremesas', descricao: 'Doces e sobremesas deliciosas' },
  { id: 2, nome: 'Carnes', descricao: 'Receitas com diferentes tipos de carne' },
  { id: 3, nome: 'Massas', descricao: 'Pratos com massas e molhos' },
  { id: 4, nome: 'Saladas', descricao: 'Saladas frescas e saudáveis' },
  { id: 5, nome: 'Sopas', descricao: 'Sopas e caldos reconfortantes' },
  { id: 6, nome: 'Vegetariano', descricao: 'Opções vegetarianas' },
]

const mockRecipes: Recipe[] = [
  {
    id: 1,
    nome: 'Bolo de Chocolate Fofo',
    categoriaId: 1,
    tempoPreparoMinutos: 45,
    porcoes: 8,
    modoPreparo: '1. Preaqueça o forno a 180°C.\n2. Misture os ingredientes secos em uma tigela.\n3. Em outra tigela, bata os ovos e adicione o leite.\n4. Misture tudo até formar uma massa homogênea.\n5. Asse por 30-35 minutos.',
    ingredientes: '2 xícaras de farinha de trigo, 1 xícara de açúcar, 1/2 xícara de cacau em pó, 3 ovos, 1 xícara de leite, 1/2 xícara de óleo, 1 colher de sopa de fermento em pó',
    userId: 1,
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z'
  },
  {
    id: 2,
    nome: 'Filé Mignon ao Molho Madeira',
    categoriaId: 2,
    tempoPreparoMinutos: 30,
    porcoes: 4,
    modoPreparo: '1. Tempere o filé mignon com sal e pimenta.\n2. Aqueça uma frigideira com azeite.\n3. Grelhe o filé por 3-4 minutos de cada lado.\n4. Para o molho, refogue cebola e alho.\n5. Adicione o vinho e deixe reduzir.',
    ingredientes: '4 filés mignon (150g cada), 1 xícara de vinho tinto, 2 colheres de sopa de cebola picada, 2 dentes de alho, 2 colheres de sopa de manteiga, sal e pimenta a gosto',
    userId: 1,
    createdAt: '2024-01-20T14:20:00Z',
    updatedAt: '2024-01-20T14:20:00Z'
  },
  {
    id: 3,
    nome: 'Lasanha Bolonhesa',
    categoriaId: 3,
    tempoPreparoMinutos: 90,
    porcoes: 6,
    modoPreparo: '1. Prepare o molho bolonhesa refogando a carne.\n2. Faça o molho bechamel.\n3. Monte a lasanha em camadas.\n4. Asse a 180°C por 45 minutos.\n5. Deixe descansar 10 minutos antes de servir.',
    ingredientes: '500g massa para lasanha, 500g carne moída, 2 xícaras molho de tomate, 500g queijo muçarela, 2 xícaras leite, 2 colheres de sopa farinha de trigo, cebola, alho, sal, orégano',
    userId: 1,
    createdAt: '2024-01-25T09:15:00Z',
    updatedAt: '2024-01-25T09:15:00Z'
  },
  {
    id: 4,
    nome: 'Salada Caesar Clássica',
    categoriaId: 4,
    tempoPreparoMinutos: 15,
    porcoes: 4,
    modoPreparo: '1. Lave e seque as folhas de alface.\n2. Prepare o molho misturando todos os ingredientes.\n3. Monte a salada com os croutons.\n4. Regue com o molho e sirva.',
    ingredientes: '1 alface romana, 1/2 xícara croutons, 1/4 xícara queijo parmesão ralado, 2 colheres de sopa maionese, 1 dente de alho, suco de 1 limão, 2 colheres de sopa azeite, sal e pimenta',
    userId: 1,
    createdAt: '2024-02-01T11:45:00Z',
    updatedAt: '2024-02-01T11:45:00Z'
  },
  {
    id: 5,
    nome: 'Sopa de Legumes Caseira',
    categoriaId: 5,
    tempoPreparoMinutos: 40,
    porcoes: 6,
    modoPreparo: '1. Refogue cebola e alho em azeite.\n2. Adicione os legumes picados.\n3. Acrescente água e deixe ferver.\n4. Cozinhe até os legumes amolecerem.\n5. Tempere a gosto e sirva quente.',
    ingredientes: '2 batatas, 2 cenouras, 1/2 repolho, 1 cebola, 2 dentes de alho, 2 litros de água, sal, cheiro-verde, azeite',
    userId: 1,
    createdAt: '2024-02-05T16:30:00Z',
    updatedAt: '2024-02-05T16:30:00Z'
  },
  {
    id: 6,
    nome: 'Risoto de Cogumelos',
    categoriaId: 6,
    tempoPreparoMinutos: 35,
    porcoes: 4,
    modoPreparo: '1. Refogue cebola e alho em azeite.\n2. Adicione o arroz arbóreo e misture.\n3. Vá adicionando o caldo de legumes aos poucos.\n4. Acrescente os cogumelos.\n5. Finalize com queijo parmesão.',
    ingredientes: '1 xícara arroz arbóreo, 200g cogumelos, 1 litro caldo de legumes, 1/2 xícara vinho branco, 1 cebola, 2 dentes de alho, 1/2 xícara queijo parmesão, manteiga',
    userId: 1,
    createdAt: '2024-02-10T13:20:00Z',
    updatedAt: '2024-02-10T13:20:00Z'
  }
]

export class MockService {
  private static delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

  static async login(login: string, senha: string): Promise<DefaultResponse<any>> {
    await this.delay(1000)

    if (login === 'admin' && senha === 'admin') {
      return {
        response: {
          access_token: 'mock-jwt-token-' + Date.now(),
          expires_in: 3600
        },
        message: 'Login realizado com sucesso',
        status: true
      }
    }

    throw new Error('Credenciais inválidas')
  }

  static async logout(): Promise<DefaultResponse<any>> {
    await this.delay(500)
    return {
      response: { message: 'Logout realizado com sucesso' },
      message: 'Logout realizado com sucesso',
      status: true
    }
  }

  static async getRecipes(filters?: { categoriaId?: number; nome?: string }): Promise<DefaultResponse<Recipe[]>> {
    await this.delay(800)

    let filteredRecipes = [...mockRecipes]

    if (filters?.categoriaId) {
      filteredRecipes = filteredRecipes.filter(r => r.categoriaId === filters.categoriaId)
    }

    if (filters?.nome) {
      const searchTerm = filters.nome.toLowerCase()
      filteredRecipes = filteredRecipes.filter(r =>
        r.nome.toLowerCase().includes(searchTerm)
      )
    }

    return {
      response: filteredRecipes,
      message: 'Receitas listadas com sucesso',
      status: true
    }
  }

  static async getRecipesPaginated(page: number, limit: number, filters?: { categoriaId?: number; nome?: string }): Promise<DefaultPaginationResponse<Recipe[]>> {
    await this.delay(800)

    let filteredRecipes = [...mockRecipes]

    if (filters?.categoriaId) {
      filteredRecipes = filteredRecipes.filter(r => r.categoriaId === filters.categoriaId)
    }

    if (filters?.nome) {
      const searchTerm = filters.nome.toLowerCase()
      filteredRecipes = filteredRecipes.filter(r => r.nome.toLowerCase().includes(searchTerm))
    }

    const total = filteredRecipes.length
    const start = Math.max(0, (page - 1) * limit)
    const end = start + limit
    const paginated = filteredRecipes.slice(start, end)

    return {
      response: paginated,
      page,
      total,
      status: paginated.length > 0,
    }
  }

  static async getRecipeById(id: number): Promise<DefaultResponse<Recipe>> {
    await this.delay(600)

    const recipe = mockRecipes.find(r => r.id === id)
    if (!recipe) {
      throw new Error('Receita não encontrada')
    }

    return {
      response: recipe,
      message: 'Receita encontrada com sucesso',
      status: true
    }
  }

  static async createRecipe(recipe: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>): Promise<DefaultResponse<Recipe>> {
    await this.delay(1000)

    const newRecipe: Recipe = {
      ...recipe,
      id: Math.max(...mockRecipes.map(r => r.id)) + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userId: 1
    }

    mockRecipes.unshift(newRecipe)

    return {
      response: newRecipe,
      message: 'Receita criada com sucesso',
      status: true
    }
  }

  static async updateRecipe(id: number, recipe: Partial<Recipe>): Promise<DefaultResponse<Recipe>> {
    await this.delay(800)

    const index = mockRecipes.findIndex(r => r.id === id)
    if (index === -1) {
      throw new Error('Receita não encontrada')
    }

    mockRecipes[index] = {
      ...mockRecipes[index],
      ...recipe,
      updatedAt: new Date().toISOString()
    } as Recipe

    return {
      response: mockRecipes[index] as Recipe,
      message: 'Receita atualizada com sucesso',
      status: true
    }
  }

  static async deleteRecipe(id: number): Promise<DefaultResponse<any>> {
    await this.delay(600)

    const index = mockRecipes.findIndex(r => r.id === id)
    if (index === -1) {
      throw new Error('Receita não encontrada')
    }

    mockRecipes.splice(index, 1)

    return {
      response: null,
      message: 'Receita removida com sucesso',
      status: true
    }
  }

  static async getCategories(): Promise<DefaultResponse<Category[]>> {
    await this.delay(500)

    return {
      response: mockCategories,
      message: 'Categorias listadas com sucesso',
      status: true
    }
  }

  static async createCategory(category: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>): Promise<DefaultResponse<Category>> {
    await this.delay(700)

    const newCategory: Category = {
      ...category,
      id: Math.max(...mockCategories.map(c => c.id)) + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    mockCategories.push(newCategory)

    return {
      response: newCategory,
      message: 'Categoria criada com sucesso',
      status: true
    }
  }

  static async updateCategory(id: number, category: Partial<Category>): Promise<DefaultResponse<Category>> {
    await this.delay(600)

    const index = mockCategories.findIndex(c => c.id === id)
    if (index === -1) {
      throw new Error('Categoria não encontrada')
    }

    mockCategories[index] = {
      ...mockCategories[index],
      ...category,
      updatedAt: new Date().toISOString()
    } as Category

    return {
      response: mockCategories[index] as Category,
      message: 'Categoria atualizada com sucesso',
      status: true
    }
  }

  static async deleteCategory(id: number): Promise<DefaultResponse<any>> {
    await this.delay(500)

    const index = mockCategories.findIndex(c => c.id === id)
    if (index === -1) {
      throw new Error('Categoria não encontrada')
    }

    // Verificar se há receitas usando esta categoria
    const hasRecipes = mockRecipes.some(r => r.categoriaId === id)
    if (hasRecipes) {
      throw new Error('Não é possível excluir categoria com receitas')
    }

    mockCategories.splice(index, 1)

    return {
      response: null,
      message: 'Categoria removida com sucesso',
      status: true
    }
  }
}
