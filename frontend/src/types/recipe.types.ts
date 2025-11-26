export interface Recipe {
  id: number
  nome: string
  categoriaId: number
  tempoPreparoMinutos: number
  porcoes: number
  modoPreparo: string
  ingredientes: string
  categoria?: Category
  userId?: number
  createdAt?: string
  updatedAt?: string
}

export interface Category {
  id: number
  nome: string
  descricao?: string
  createdAt?: string
  updatedAt?: string
}

export interface RecipeFilters {
  categoriaId?: number
  nome?: string
}

export interface PaginationInfo {
  page: number
  limit: number
  total: number
  totalPages: number
}
