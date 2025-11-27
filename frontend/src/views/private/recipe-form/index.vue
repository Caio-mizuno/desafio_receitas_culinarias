<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-btn color="secondary" variant="text" prepend-icon="mdi-arrow-left" @click="goBack" class="mb-4">Voltar</v-btn>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="8">
        <v-card elevation="4">
          <v-card-title class="text-h5">{{ isEdit ? 'Editar Receita' : 'Nova Receita' }}</v-card-title>

          <v-card-text>
            <v-form @submit.prevent="handleSubmit" ref="formRef">
              <v-text-field
                v-model="recipeForm.nome"
                label="Nome da Receita"
                prepend-inner-icon="mdi-chef-hat"
                variant="outlined"
                :rules="[v => !!v || 'Nome é obrigatório']"
                required
                class="mb-4"
              />

              <v-select
                v-model="recipeForm.categoriaId"
                label="Categoria"
                prepend-inner-icon="mdi-tag-outline"
                variant="outlined"
                :items="categoryStore.categoryOptions"
                item-title="text"
                item-value="value"
                :rules="[v => !!v || 'Categoria é obrigatória']"
                required
                class="mb-4"
              />

              <v-row class="mb-4">
                <v-col cols="6">
                  <v-text-field
                    v-model.number="recipeForm.tempoPreparoMinutos"
                    label="Tempo de Preparo (min)"
                    prepend-inner-icon="mdi-clock-outline"
                    variant="outlined"
                    type="number"
                    :rules="[v => !!v || 'Tempo é obrigatório', v => v > 0 || 'Tempo deve ser positivo']"
                    required
                  />
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    v-model.number="recipeForm.porcoes"
                    label="Número de Porções"
                    prepend-inner-icon="mdi-silverware"
                    variant="outlined"
                    type="number"
                    :rules="[v => !!v || 'Porções é obrigatório', v => v > 0 || 'Porções deve ser positivo']"
                    required
                  />
                </v-col>
              </v-row>

              <v-textarea
                v-model="recipeForm.ingredientes"
                label="Ingredientes"
                prepend-inner-icon="mdi-basket-outline"
                variant="outlined"
                rows="6"
                :rules="[v => !!v || 'Ingredientes são obrigatórios']"
                required
                class="mb-4"
                hint="Liste todos os ingredientes necessários"
              />

              <v-textarea
                v-model="recipeForm.modoPreparo"
                label="Modo de Preparo"
                prepend-inner-icon="mdi-chef-hat"
                variant="outlined"
                rows="8"
                :rules="[v => !!v || 'Modo de preparo é obrigatório']"
                required
                class="mb-4"
                hint="Descreva detalhadamente o passo a passo"
              />

              <v-alert v-if="recipeStore.error" type="error" variant="tonal" closable @click:close="recipeStore.clearError" class="mb-4">
                {{ recipeStore.error }}
              </v-alert>

              <v-row>
                <v-col cols="12" class="d-flex justify-end">
                  <v-btn color="grey" variant="text" @click="goBack" class="mr-2">Cancelar</v-btn>
                  <v-btn type="submit" color="primary" :loading="recipeStore.loading" :disabled="recipeStore.loading">
                    {{ isEdit ? 'Atualizar' : 'Criar' }} Receita
                  </v-btn>
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card elevation="2" class="preview-card">
          <v-card-title>
            <v-icon start>mdi-eye-outline</v-icon>
            Pré-visualização
          </v-card-title>

          <v-card-text>
            <div v-if="recipeForm.nome" class="text-h6 mb-2">{{ recipeForm.nome }}</div>
            <div v-else class="text-h6 text-grey mb-2">Nome da Receita</div>

            <v-row v-if="recipeForm.categoriaId" class="mb-4">
              <v-col cols="12">
                <v-chip color="primary" size="small">{{ getCategoryName(recipeForm.categoriaId) }}</v-chip>
              </v-col>
            </v-row>

            <v-row v-if="recipeForm.tempoPreparoMinutos || recipeForm.porcoes" class="mb-4">
              <v-col cols="6" v-if="recipeForm.tempoPreparoMinutos" class="text-center">
                <v-icon size="20" color="primary">mdi-clock-outline</v-icon>
                <div class="text-caption">{{ recipeForm.tempoPreparoMinutos }} min</div>
              </v-col>
              <v-col cols="6" v-if="recipeForm.porcoes" class="text-center">
                <v-icon size="20" color="primary">mdi-silverware</v-icon>
                <div class="text-caption">{{ recipeForm.porcoes }} porções</div>
              </v-col>
            </v-row>

            <v-divider class="mb-4" />

            <div v-if="recipeForm.ingredientes" class="mb-4">
              <div class="text-subtitle-2 text-primary mb-2">Ingredientes:</div>
              <div class="text-caption">{{ recipeForm.ingredientes }}</div>
            </div>

            <div v-if="recipeForm.modoPreparo" class="mb-4">
              <div class="text-subtitle-2 text-primary mb-2">Modo de Preparo:</div>
              <div class="text-caption">{{ recipeForm.modoPreparo }}</div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useRecipeStore } from '@/stores/recipe.store'
import { useCategoryStore } from '@/stores/category.store'
import './styles.css'

const router = useRouter()
const route = useRoute()
const recipeStore = useRecipeStore()
const categoryStore = useCategoryStore()

const formRef = ref()
const isEdit = computed(() => !!route.params.id)

const recipeForm = reactive({
  nome: '',
  categoriaId: null as number | null,
  tempoPreparoMinutos: null as number | null,
  porcoes: null as number | null,
  ingredientes: '',
  modoPreparo: ''
})

const getCategoryName = (categoryId: number | null) => {
  const category = categoryStore.categories.find(c => c.id === categoryId)
  return category?.nome || ''
}

const loadRecipe = async () => {
  if (!isEdit.value) return
  const recipeId = Number(route.params.id)
  const result = await recipeStore.fetchRecipeById(recipeId)
  if (result.success && recipeStore.currentRecipe) {
    const recipe = recipeStore.currentRecipe
    Object.assign(recipeForm, {
      nome: recipe.nome,
      categoriaId: recipe.categoriaId,
      tempoPreparoMinutos: recipe.tempoPreparoMinutos,
      porcoes: recipe.porcoes,
      ingredientes: recipe.ingredientes,
      modoPreparo: recipe.modoPreparo
    })
  }
}

const handleSubmit = async () => {
  const { valid } = await formRef.value.validate()
  if (!valid) return

  const recipeData = {
    nome: recipeForm.nome,
    categoriaId: recipeForm.categoriaId!,
    tempoPreparoMinutos: recipeForm.tempoPreparoMinutos!,
    porcoes: recipeForm.porcoes!,
    ingredientes: recipeForm.ingredientes,
    modoPreparo: recipeForm.modoPreparo
  }

  let result
  if (isEdit.value) {
    result = await recipeStore.updateRecipe(Number(route.params.id), recipeData)
  } else {
    result = await recipeStore.createRecipe(recipeData)
  }

  if (result.success) {
    router.push('/minhas-receitas')
  }
}

const goBack = () => {
  router.push('/minhas-receitas')
}

onMounted(async () => {
  await categoryStore.fetchCategories()
  if (isEdit.value) {
    await loadRecipe()
  }
})
</script>

