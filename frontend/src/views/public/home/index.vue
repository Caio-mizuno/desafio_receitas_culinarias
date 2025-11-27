<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1 class="text-h3 font-weight-bold mb-6">Receitas Culinárias</h1>

        <v-card class="mb-6" elevation="2">
          <v-card-text>
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="searchTerm"
                  label="Buscar receita por nome"
                  prepend-inner-icon="mdi-magnify"
                  variant="outlined"
                  density="compact"
                  @input="debouncedSearch"
                />
              </v-col>
              <v-col cols="12" md="4">
                <v-select
                  v-model="selectedCategory"
                  label="Filtrar por categoria"
                  :items="categoryStore.categoryOptions"
                  item-title="text"
                  item-value="value"
                  prepend-inner-icon="mdi-filter"
                  variant="outlined"
                  density="compact"
                  clearable
                  @update:model-value="applyFilters"
                />
              </v-col>
              <v-col cols="12" md="2">
                <v-btn
                  color="secondary"
                  variant="tonal"
                  @click="clearFilters"
                  block
                  class="mt-1"
                >
                  Limpar
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <v-row v-if="recipeStore.loading">
          <v-col cols="12" sm="6" md="4" lg="3" v-for="n in 8" :key="n">
            <v-skeleton-loader type="card" />
          </v-col>
        </v-row>

        <v-row v-else-if="filteredRecipes.length > 0">
          <v-col cols="12" sm="6" md="4" lg="3" v-for="recipe in filteredRecipes" :key="recipe.id">
            <v-card
              hover
              elevation="3"
              class="recipe-card"
              @click="goToRecipe(recipe.id)"
            >
              <v-img
                height="200"
                src="https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=delicious%20food%20plate%20with%20fresh%20ingredients%20gourmet%20presentation&image_size=square"
                cover
                class="align-end"
              >
                <v-chip color="primary" class="ma-2" size="small">
                  {{ getCategoryName(recipe.categoriaId) }}
                </v-chip>
              </v-img>

              <v-card-title class="text-h6">
                {{ recipe.nome }}
              </v-card-title>

              <v-card-text>
                <v-row no-gutters class="mb-2">
                  <v-col cols="6" class="d-flex align-center">
                    <v-icon size="16" color="grey" class="mr-1">mdi-clock-outline</v-icon>
                    <span class="text-caption">{{ recipe.tempoPreparoMinutos }} min</span>
                  </v-col>
                  <v-col cols="6" class="d-flex align-center">
                    <v-icon size="16" color="grey" class="mr-1">mdi-silverware</v-icon>
                    <span class="text-caption">{{ recipe.porcoes }} porções</span>
                  </v-col>
                </v-row>

                <div class="text-truncate text-caption text-grey">
                  {{ recipe.ingredientes }}
                </div>
              </v-card-text>

              <v-card-actions>
                <v-spacer />
                <v-btn color="primary" variant="text" @click.stop="goToRecipe(recipe.id)">
                  Ver Receita
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>

        <v-row v-else>
          <v-col cols="12" class="text-center">
            <v-icon size="128" color="grey-lighten-2" class="mb-4">mdi-chef-hat</v-icon>
            <h3 class="text-h5 text-grey">Nenhuma receita encontrada</h3>
            <p class="text-body-1 text-grey-lighten-1">
              Tente ajustar seus filtros ou volte mais tarde.
            </p>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
  
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useRecipeStore } from '@/stores/recipe.store'
import { useCategoryStore } from '@/stores/category.store'
import { debounce } from './service'
import './styles.css'

const router = useRouter()
const recipeStore = useRecipeStore()
const categoryStore = useCategoryStore()

const searchTerm = ref('')
const selectedCategory = ref<number | null>(null)

const filteredRecipes = computed(() => recipeStore.filteredRecipes)

const debouncedSearch = debounce(() => {
  applyFilters()
}, 500)

const applyFilters = () => {
  recipeStore.setFilters({
    nome: searchTerm.value || undefined,
    categoriaId: selectedCategory.value || undefined,
  })
}

const clearFilters = () => {
  searchTerm.value = ''
  selectedCategory.value = null
  recipeStore.clearFilters()
}

const goToRecipe = (id: number) => {
  router.push(`/receitas/${id}`)
}

const getCategoryName = (categoriaId: number) => {
  const category = categoryStore.categories.find(c => c.id === categoriaId)
  return category?.nome || 'Sem Categoria'
}

onMounted(async () => {
  await Promise.all([
    recipeStore.fetchRecipes(),
    categoryStore.fetchCategories(),
  ])
})
</script>

