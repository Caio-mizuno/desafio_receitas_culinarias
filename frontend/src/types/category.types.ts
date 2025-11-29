export interface Category {
  id: number
  nome: string
  descricao?: string
  createdAt?: string
  updatedAt?: string
}

export interface CategoryWithCountDto extends Category {
  receitasContagem: number
}
