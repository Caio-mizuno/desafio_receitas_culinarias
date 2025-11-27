<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <div class="d-flex justify-space-between align-center mb-6">
          <h1 class="text-h3 font-weight-bold">Minhas Receitas</h1>
          <v-btn color="primary" prepend-icon="mdi-plus" @click="goToCreateRecipe">Nova Receita</v-btn>
        </div>

        <v-row v-if="recipeStore.loading">
          <v-col cols="12" sm="6" md="4" lg="3" v-for="n in 8" :key="n">
            <v-skeleton-loader type="card" />
          </v-col>
        </v-row>

        <v-row v-else-if="myRecipes.length > 0">
          <v-col cols="12" sm="6" md="4" lg="3" v-for="recipe in myRecipes" :key="recipe.id">
            <v-card elevation="3">
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

              <v-card-title class="text-h6">{{ recipe.nome }}</v-card-title>

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

                <div class="text-truncate text-caption text-grey">{{ recipe.ingredientes }}</div>
              </v-card-text>

              <v-card-actions>
                <v-spacer />
                <v-btn color="primary" variant="text" prepend-icon="mdi-pencil" @click="goToEditRecipe(recipe.id)">Editar</v-btn>
                <v-btn color="error" variant="text" prepend-icon="mdi-delete" @click="confirmDelete(recipe)">Excluir</v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>

        <v-row v-else>
          <v-col cols="12" class="text-center">
            <v-icon size="128" color="grey-lighten-2" class="mb-4">mdi-chef-hat</v-icon>
            <h3 class="text-h5 text-grey">Você ainda não tem receitas</h3>
            <p class="text-body-1 text-grey-lighten-1">Crie sua primeira receita clicando no botão "Nova Receita".</p>
            <v-btn color="primary" prepend-icon="mdi-plus" @click="goToCreateRecipe" class="mt-4">Criar Primeira Receita</v-btn>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <v-dialog v-model="deleteDialog" max-width="400">
      <v-card>
        <v-card-title class="text-h5">Confirmar Exclusão</v-card-title>
        <v-card-text>Tem certeza que deseja excluir a receita "{{ recipeToDelete?.nome }}"? Esta ação não pode ser desfeita.</v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="grey" variant="text" @click="deleteDialog = false">Cancelar</v-btn>
          <v-btn color="error" variant="elevated" @click="deleteRecipe" :loading="recipeStore.loading">Excluir</v-btn>
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

const router = useRouter()
const recipeStore = useRecipeStore()
const categoryStore = useCategoryStore()

const deleteDialog = ref(false)
const recipeToDelete = ref<Recipe | null>(null)

const myRecipes = computed(() => recipeStore.recipes)

const getCategoryName = (categoriaId: number) => {
  const category = categoryStore.categories.find(c => c.id === categoriaId)
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
  }
}

onMounted(async () => {
  await Promise.all([
    recipeStore.fetchRecipes(),
    categoryStore.fetchCategories(),
  ])
})
</script>

