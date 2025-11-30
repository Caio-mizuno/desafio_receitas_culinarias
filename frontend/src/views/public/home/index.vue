<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div>
    <v-container class="py-12">
      <v-row align="center">
        <v-col cols="12" class="hero-banner">
          <v-img
            src="/banner2.jpg"
            cover
            height="480"
            class="rounded-lg"
            gradient="to top, rgba(0,0,0,.8), rgba(0,0,0,0)"
          >
            <div class="hero-overlay d-flex align-end pa-8">
              <div>
                <h1 class="text-h2 font-weight-bold mb-4 text-white">Descubra novas receitas</h1>
                <p class="text-subtitle-3 text-white mb-6">
                  Inspire-se com as últimas criações da comunidade e encontre sua próxima refeição
                  favorita.
                </p>
                <div class="d-flex flex-wrap gap-3">
                  <v-btn color="secondary" size="large" @click="goToRecipes">
                    Ver todas as receitas
                  </v-btn>
                  <v-btn
                    color="secondary"
                    variant="tonal"
                    size="large"
                    @click="goToCreate"
                    v-if="canCreate"
                  >
                    Criar receita
                  </v-btn>
                </div>
              </div>
            </div>
          </v-img>
        </v-col>
        <v-row class="mt-6" justify="center" align="end">
          <div>
            <h3 class="text-h6 font-weight-bold mb-2">Fervendo 🔥</h3>
          </div>
          <div class="chip-mg-3" v-for="cat in topCategories" :key="cat.id">
            <v-chip
              :loading="categoryLoading"
              color="primary"
              variant="outlined"
              clickable
              @click="selectCategory(cat.id)"
              :class="{ 'active-chip': selectedCategoryId === cat.id }"
            >
              {{ cat.nome }}
            </v-chip>
          </div>
        </v-row>
        <v-col cols="12" v-if="selectedCategoryId !== null" class="mt-4">
          <v-col cols="12">
            <div class="d-flex align-center justify-space-between mb-2">
              <h2 class="text-h5 font-weight-bold">
                Receitas em {{ getCategoryName(selectedCategoryId!) }}
                <span>
                  <v-btn variant="text" color="primary" @click="goToRecipes" :ripple="false"
                    >Ver todas</v-btn
                  ></span
                >
              </h2>
            </div>
            <v-skeleton-loader v-if="categoryLoading" type="card, card, card" />
            <v-row v-else>
              <v-col cols="12" sm="6" md="4" lg="3" v-for="r in categoryRecipes" :key="r.id">
                <v-card class="rounded-lg w-80" hover @click="goToRecipe(r.id)">
                  <v-card-title class="text-subtitle-1 font-weight-bold">
                    {{ r.nome }}
                  </v-card-title>
                  <v-card-text>
                    <div>
                      Porções:
                      <v-chip size="small" color="secondary" variant="outlined">
                        <v-icon class="mr-2">mdi-silverware</v-icon>{{ r.porcoes }} porções
                      </v-chip>
                    </div>
                    <div class="mt-2">
                      Tempo de preparo:
                      <v-chip size="small" color="secondary" variant="tonal">
                        <v-icon class="mr-2">mdi-clock-outline</v-icon
                        >{{ r.tempoPreparoMinutos }} min
                      </v-chip>
                    </div>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-col>
        </v-col>
      </v-row>
    </v-container>

    <v-container>
      <v-row>
        <v-col cols="12">
          <div class="d-flex align-center justify-space-between mb-4">
            <h2 class="text-h4 font-weight-bold">Últimas receitas</h2>
            <v-btn variant="text" color="primary" @click="goToRecipes">Ver todas</v-btn>
          </div>

          <v-skeleton-loader v-if="loading" type="image, article" class="mb-6" />

          <RecipesCarousel
            v-else
            :items="latestRecipes"
            :getCategoryName="getCategoryName"
            @open="goToRecipe($event)"
          />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useRecipeStore } from '@/stores/recipe.store'
import { useCategoryStore } from '@/stores/category.store'
import { useAuthStore } from '@/stores/auth.store'
import type { Recipe } from '@/types/recipe.types'
import RecipesCarousel from '@/components/carousels/RecipesCarousel.vue'
import {
  getCategoryNameFromList,
  navigateToRecipes,
  navigateToCreate,
  navigateToRecipe,
  getRecipesByCategory,
} from './service'

const router = useRouter()
const recipeStore = useRecipeStore()
const categoryStore = useCategoryStore()
const authStore = useAuthStore()

const canCreate = computed(() => authStore.isAuthenticated)
const loading = ref(false)
const categoryLoading = ref(false)
const selectedCategoryId = ref<number | null>(null)
const categoryRecipes = ref<Recipe[]>([])

const latestRecipes = ref<Recipe[]>([])

const topCategories = computed(() => {
  return categoryStore.categories.slice(0, 6)
})

const getCategoryName = (categoriaId: number) =>
  getCategoryNameFromList(categoryStore.categories, categoriaId)

const goToRecipes = () => navigateToRecipes(router)
const goToCreate = () => navigateToCreate(router)
const goToRecipe = (id: number) => navigateToRecipe(router, id)

const selectCategory = async (id: number) => {
  selectedCategoryId.value = id
  categoryLoading.value = true
  try {
    categoryRecipes.value = await getRecipesByCategory(id, 5)
  } finally {
    categoryLoading.value = false
  }
}

onMounted(async () => {
  loading.value = true
  await Promise.all([recipeStore.fetchRecipes(), categoryStore.fetchCategories()])
  const sorted = [...recipeStore.recipes].sort((a, b) => {
    const da = a.createdAt ? new Date(a.createdAt).getTime() : 0
    const db = b.createdAt ? new Date(b.createdAt).getTime() : 0
    return db - da
  })
  latestRecipes.value = sorted.slice(0, 5)
  loading.value = false
})
</script>

<style src="@/views/public/home/style.css" scoped></style>
