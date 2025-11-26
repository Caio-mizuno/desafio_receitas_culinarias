<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1 class="text-h3 font-weight-bold mb-6">Categorias</h1>

        <!-- Loading -->
        <v-row v-if="categoryStore.loading">
          <v-col cols="12" sm="6" md="4" lg="3" v-for="n in 8" :key="n">
            <v-skeleton-loader type="card" />
          </v-col>
        </v-row>

        <!-- Lista de Categorias -->
        <v-row v-else-if="categories.length > 0">
          <v-col cols="12" sm="6" md="4" lg="3" v-for="category in categories" :key="category.id">
            <v-card
              hover
              elevation="3"
              class="category-card"
              @click="filterByCategory(category.id)"
            >
              <v-card-text class="text-center pa-6">
                <v-icon
                  size="48"
                  color="primary"
                  class="mb-4"
                >
                  mdi-tag-outline
                </v-icon>

                <v-card-title class="text-h6 mb-2">
                  {{ category.nome }}
                </v-card-title>

                <div v-if="category.descricao" class="text-body-2 text-grey mb-4">
                  {{ category.descricao }}
                </div>

                <v-chip color="secondary" size="small">
                  {{ getRecipeCountByCategory(category.id) }} receitas
                </v-chip>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <!-- Empty State -->
        <v-row v-else>
          <v-col cols="12" class="text-center">
            <v-icon size="128" color="grey-lighten-2" class="mb-4">mdi-tag-outline</v-icon>
            <h3 class="text-h5 text-grey">Nenhuma categoria encontrada</h3>
            <p class="text-body-1 text-grey-lighten-1">
              Volte mais tarde quando houver categorias disponíveis.
            </p>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCategoryStore } from '@/stores/category.store'
import { useRecipeStore } from '@/stores/recipe.store'

const router = useRouter()
const categoryStore = useCategoryStore()
const recipeStore = useRecipeStore()

const categories = computed(() => categoryStore.categories)

const getRecipeCountByCategory = (categoryId: number) => {
  return recipeStore.recipes.filter(recipe => recipe.categoriaId === categoryId).length
}

const filterByCategory = (categoryId: number) => {
  recipeStore.setFilters({ categoriaId })
  router.push('/')
}

onMounted(async () => {
  await Promise.all([
    categoryStore.fetchCategories(),
    recipeStore.fetchRecipes()
  ])
})
</script>

<style scoped>
.category-card {
  cursor: pointer;
  transition: transform 0.2s ease-in-out;
  height: 100%;
}

.category-card:hover {
  transform: translateY(-4px);
}
</style>
