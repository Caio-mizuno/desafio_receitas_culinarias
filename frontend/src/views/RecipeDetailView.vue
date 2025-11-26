<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-btn
          color="secondary"
          variant="text"
          prepend-icon="mdi-arrow-left"
          @click="goBack"
          class="mb-4"
        >
          Voltar
        </v-btn>
      </v-col>
    </v-row>

    <!-- Loading -->
    <v-row v-if="recipeStore.loading">
      <v-col cols="12">
        <v-skeleton-loader type="card, article, list-item-three-line" />
      </v-col>
    </v-row>

    <!-- Recipe Detail -->
    <v-row v-else-if="recipe">
      <v-col cols="12">
        <v-card elevation="4">
          <v-img
            height="300"
            src="https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=delicious%20food%20plate%20with%20fresh%20ingredients%20gourmet%20presentation%20professional%20photography&image_size=landscape_16_9"
            cover
          >
            <v-card-title class="text-h4 font-weight-bold bg-gradient-primary pa-4">
              {{ recipe.nome }}
            </v-card-title>
          </v-img>

          <v-card-text class="pa-6">
            <!-- Informações Rápidas -->
            <v-row class="mb-6">
              <v-col cols="12" sm="4" class="text-center">
                <v-icon size="32" color="primary" class="mb-2">mdi-clock-outline</v-icon>
                <div class="text-h6">{{ recipe.tempoPreparoMinutos }} min</div>
                <div class="text-caption text-grey">Tempo de Preparo</div>
              </v-col>
              <v-col cols="12" sm="4" class="text-center">
                <v-icon size="32" color="primary" class="mb-2">mdi-silverware</v-icon>
                <div class="text-h6">{{ recipe.porcoes }} porções</div>
                <div class="text-caption text-grey">Rendimento</div>
              </v-col>
              <v-col cols="12" sm="4" class="text-center">
                <v-icon size="32" color="primary" class="mb-2">mdi-tag-outline</v-icon>
                <div class="text-h6">{{ getCategoryName(recipe.categoriaId) }}</div>
                <div class="text-caption text-grey">Categoria</div>
              </v-col>
            </v-row>

            <v-divider class="mb-6" />

            <!-- Ingredientes -->
            <v-expansion-panels class="mb-6">
              <v-expansion-panel>
                <v-expansion-panel-title>
                  <template #default="{ expanded }">
                    <v-row no-gutters align="center">
                      <v-icon color="primary" class="mr-3">mdi-basket-outline</v-icon>
                      <span class="text-h6">Ingredientes</span>
                      <v-spacer />
                      <v-fade-transition>
                        <v-chip v-if="!expanded" color="primary" size="small">
                          Clique para ver
                        </v-chip>
                      </v-fade-transition>
                    </v-row>
                  </template>
                </v-expansion-panel-title>
                <v-expansion-panel-text>
                  <div class="ingredients-content">
                    <p class="text-body-1">{{ recipe.ingredientes }}</p>
                  </div>
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>

            <!-- Modo de Preparo -->
            <v-expansion-panels class="mb-6">
              <v-expansion-panel>
                <v-expansion-panel-title>
                  <template #default="{ expanded }">
                    <v-row no-gutters align="center">
                      <v-icon color="primary" class="mr-3">mdi-chef-hat</v-icon>
                      <span class="text-h6">Modo de Preparo</span>
                      <v-spacer />
                      <v-fade-transition>
                        <v-chip v-if="!expanded" color="primary" size="small">
                          Clique para ver
                        </v-chip>
                      </v-fade-transition>
                    </v-row>
                  </template>
                </v-expansion-panel-title>
                <v-expansion-panel-text>
                  <div class="preparation-content">
                    <p class="text-body-1">{{ recipe.modoPreparo }}</p>
                  </div>
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>

            <!-- Informações Adicionais -->
            <v-row v-if="recipe.createdAt">
              <v-col cols="12">
                <v-alert
                  type="info"
                  variant="tonal"
                  icon="mdi-information-outline"
                >
                  <template #text>
                    <div class="text-caption">
                      Receita criada em: {{ formatDate(recipe.createdAt) }}
                    </div>
                  </template>
                </v-alert>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Error State -->
    <v-row v-else-if="recipeStore.error">
      <v-col cols="12" class="text-center">
        <v-icon size="128" color="error" class="mb-4">mdi-alert-circle-outline</v-icon>
        <h3 class="text-h5 text-error">Erro ao carregar receita</h3>
        <p class="text-body-1 text-grey">{{ recipeStore.error }}</p>
        <v-btn
          color="primary"
          @click="fetchRecipe"
          class="mt-4"
        >
          Tentar Novamente
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useRecipeStore } from '@/stores/recipe.store'
import { useCategoryStore } from '@/stores/category.store'

const router = useRouter()
const route = useRoute()
const recipeStore = useRecipeStore()
const categoryStore = useCategoryStore()

const recipeId = computed(() => Number(route.params.id))
const recipe = computed(() => recipeStore.currentRecipe)

const fetchRecipe = async () => {
  await recipeStore.fetchRecipeById(recipeId.value)
}

const goBack = () => {
  router.push('/')
}

const getCategoryName = (categoriaId: number) => {
  const category = categoryStore.categories.find(c => c.id === categoriaId)
  return category?.nome || 'Sem Categoria'
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  })
}

onMounted(async () => {
  await Promise.all([
    fetchRecipe(),
    categoryStore.fetchCategories()
  ])
})
</script>

<style scoped>
.bg-gradient-primary {
  background: linear-gradient(135deg, rgba(76, 175, 80, 0.9) 0%, rgba(76, 175, 80, 0.7) 100%);
  color: white !important;
}

.ingredients-content,
.preparation-content {
  white-space: pre-line;
  line-height: 1.6;
}
</style>
