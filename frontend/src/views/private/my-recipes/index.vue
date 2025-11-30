<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <div class="d-flex justify-space-between align-center mb-6">
          <h1 class="text-h3 font-weight-bold">Minhas Receitas</h1>
          <v-btn color="primary" prepend-icon="mdi-plus" @click="goToCreateRecipe"
            >Nova Receita</v-btn
          >
        </div>

        <v-row class="mb-4">
          <v-col cols="12" md="5">
            <v-text-field
              v-model="searchTerm"
              label="Buscar por nome"
              clearable
              prepend-inner-icon="mdi-magnify"
              @keyup.enter="applyFilters"
            />
          </v-col>
          <v-col cols="12" md="4">
            <v-select
              v-model="selectedCategory"
              :items="categoryStore.categories"
              item-title="nome"
              item-value="id"
              label="Categoria"
              clearable
            />
          </v-col>
          <v-col cols="12" md="2" class="d-flex mt-2">
            <v-btn
              class="mr-2"
              color="primary"
              size="large"
              @click="applyFilters"
              prepend-icon="mdi-filter"
              >Filtrar</v-btn
            >
            <v-btn
              v-if="selectedCategory || searchTerm"
              variant="text"
              color="grey"
              size="large"
              @click="clearFiltersUI"
              prepend-icon="mdi-filter-minus"
              >Limpar</v-btn
            >
          </v-col>
        </v-row>

        <v-row v-if="recipeStore.loading">
          <v-col cols="12" sm="6" md="4" lg="3" v-for="n in 8" :key="n">
            <v-skeleton-loader type="card" />
          </v-col>
        </v-row>

        <v-row v-else-if="myRecipes.length > 0">
          <v-col cols="12" sm="6" md="4" lg="3" v-for="recipe in myRecipes" :key="recipe.id">
            <MyRecipeCard
              :recipe="recipe"
              :categoryName="getCategoryName(recipe.categoriaId)"
              :deleteLoading="recipeStore.loading"
              @edit="goToEditRecipe"
              @delete="confirmDelete"
            />
          </v-col>
        </v-row>

        <div v-if="myRecipes.length > 0" class="d-flex justify-center mt-6">
          <v-pagination
            v-model="recipeStore.pagination.page"
            :length="recipeStore.pagination.totalPages"
            :total-visible="5"
            prev-icon="mdi-chevron-left"
            next-icon="mdi-chevron-right"
            :disabled="recipeStore.loading"
            @update:model-value="changePage"
            @next="changePage"
            @prev="changePage"
            @first="changePage"
            @last="changePage"
          />
        </div>

        <v-row v-else>
          <v-col cols="12" class="text-center">
            <v-icon size="128" color="grey-lighten-2" class="mb-4">mdi-chef-hat</v-icon>
            <h3 class="text-h5 text-grey">Você ainda não tem receitas</h3>
            <p class="text-body-1 text-grey-lighten-1">
              Crie sua primeira receita clicando no botão "Nova Receita".
            </p>
            <v-btn color="primary" prepend-icon="mdi-plus" @click="goToCreateRecipe" class="mt-4"
              >Criar Primeira Receita</v-btn
            >
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <v-dialog v-model="deleteDialog" max-width="400">
      <v-card>
        <v-card-title class="text-h5">Confirmar Exclusão</v-card-title>
        <v-card-text
          >Tem certeza que deseja excluir a receita "{{ recipeToDelete?.nome }}"? Esta ação não pode
          ser desfeita.</v-card-text
        >
        <v-card-actions>
          <v-spacer />
          <v-btn color="grey" variant="text" @click="deleteDialog = false">Cancelar</v-btn>
          <v-btn
            color="error"
            variant="elevated"
            @click="deleteRecipe"
            :loading="recipeStore.loading"
            >Excluir</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useRecipeStore } from '@/stores/recipe.store'
import { useCategoryStore } from '@/stores/category.store'
import type { Recipe } from '@/types/recipe.types'
import './styles.css'
import MyRecipeCard from '@/components/cards/MyRecipeCard.vue'

const router = useRouter()
const recipeStore = useRecipeStore()
const categoryStore = useCategoryStore()

const deleteDialog = ref(false)
const recipeToDelete = ref<Recipe | null>(null)

const searchTerm = ref('')
const selectedCategory = ref<number | null>(null)

const myRecipes = computed(() => recipeStore.recipes)

const getCategoryName = (categoriaId: number) => {
  const category = categoryStore.categories.find((c) => c.id === categoriaId)
  return category?.nome || 'Sem Categoria'
}

const goToCreateRecipe = () => {
  router.push('/minhas-receitas/nova')
}

const goToEditRecipe = (id: number) => {
  router.push(`/minhas-receitas/${id}/editar`)
}

const confirmDelete = (recipe: Recipe) => {
  recipeToDelete.value = recipe
  deleteDialog.value = true
}

const deleteRecipe = async () => {
  if (!recipeToDelete.value) return
  const result = await recipeStore.deleteRecipe(recipeToDelete.value.id)
  if (result.success) {
    deleteDialog.value = false
    recipeToDelete.value = null
    await recipeStore.fetchMyRecipesPaginated(
      recipeStore.pagination.page,
      recipeStore.pagination.limit,
      buildFilters(),
    )
  }
}

const buildFilters = () => {
  return {
    nome: searchTerm.value || undefined,
    categoriaId: selectedCategory.value ?? undefined,
  }
}

const applyFilters = async () => {
  recipeStore.setFilters(buildFilters())
  await recipeStore.fetchMyRecipesPaginated(1, recipeStore.pagination.limit, buildFilters())
}

const clearFiltersUI = async () => {
  searchTerm.value = ''
  selectedCategory.value = null
  recipeStore.clearFilters()
  await recipeStore.fetchMyRecipesPaginated(1, recipeStore.pagination.limit)
}

const changePage = async (page: number) => {
  await recipeStore.fetchMyRecipesPaginated(page, recipeStore.pagination.limit, buildFilters())
}

onMounted(async () => {
  await categoryStore.fetchCategories()
  await recipeStore.fetchMyRecipesPaginated(1, recipeStore.pagination.limit)
})
</script>
