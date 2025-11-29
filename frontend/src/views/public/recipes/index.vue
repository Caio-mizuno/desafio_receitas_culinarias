<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card class="mb-6" elevation="2">
          <v-card-title class="text-h3 font-weight-bold mb-6"
            >O que você quer cozinhar hoje?</v-card-title
          >
          <v-card-subtitle class="text-h5 font-weight-bold mb-6"
            >Encontre receitas deliciosas com base em seus ingredientes
            favoritos.</v-card-subtitle
          >
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
                  prepend-icon="mdi-filter-minus"
                >
                  Limpar
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <v-row v-if="loading">
          <v-col cols="12" sm="6" md="4" lg="3" v-for="n in 8" :key="n">
            <v-skeleton-loader type="card" />
          </v-col>
        </v-row>

        <v-row v-else-if="recipes.length > 0">
          <v-col
            cols="12"
            sm="6"
            md="4"
            lg="3"
            v-for="recipe in recipes"
            :key="recipe.id"
          >
            <RecipeCard
              :recipe="recipe"
              :categoryName="getCategoryName(recipe.categoriaId)"
              @view="goToRecipe"
            />
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

        <v-row v-if="canLoadMore(pagination) && !loading">
          <v-col cols="12" class="d-flex justify-center">
            <v-btn color="primary" variant="tonal" @click="loadMore">Carregar mais</v-btn>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useCategoryStore } from "@/stores/category.store";
import RecipeCard from "@/components/cards/RecipeCard.vue";
import {
  debounce,
  buildRecipeFilters,
  fetchPaginatedRecipes,
  updatePaginationInfo,
  canLoadMore,
} from "./service";
import "./styles.css";

const router = useRouter();
const route = useRoute();
const categoryStore = useCategoryStore();

const searchTerm = ref("");
const selectedCategory = ref<number | null>(null);
const recipes = ref([] as any[]);
const loading = ref(false);
const error = ref<string | null>(null);
const pagination = ref({ page: 1, limit: 12, total: 0, totalPages: 1 });

const debouncedSearch = debounce(() => {
  applyFilters();
}, 500);

const applyFilters = async () => {
  pagination.value.page = 1;
  await loadPage();
};

const clearFilters = async () => {
  searchTerm.value = "";
  selectedCategory.value = null;
  pagination.value.page = 1;
  await loadPage();
};

const goToRecipe = (id: number) => {
  router.push(`/receitas/${id}`);
};

const getCategoryName = (categoriaId: number) => {
  const category = categoryStore.categories.find((c) => c.id === categoriaId);
  return category?.nome || "Sem Categoria";
};

onMounted(async () => {
  const q = route.query.categoriaId as undefined | string | string[];
  const initial = Array.isArray(q) ? Number(q[0]) : Number(q);
  selectedCategory.value = Number.isFinite(initial) ? initial : null;
  await categoryStore.fetchCategories();
  await loadPage();
});

async function loadPage() {
  loading.value = true;
  error.value = null;
  try {
    const filters = buildRecipeFilters(searchTerm.value, selectedCategory.value);
    const data = await fetchPaginatedRecipes(
      pagination.value.page,
      pagination.value.limit,
      filters
    );
    if (pagination.value.page === 1) {
      recipes.value = data.response;
    } else {
      recipes.value = [...recipes.value, ...data.response];
    }
    updatePaginationInfo(pagination.value, data.total);
  } catch (e: any) {
    error.value = e?.response?.data?.message || "Erro ao carregar receitas";
  } finally {
    loading.value = false;
  }
}

async function loadMore() {
  if (!canLoadMore(pagination.value)) return;
  pagination.value.page += 1;
  await loadPage();
}

watch(
  () => route.query.categoriaId,
  async (newVal) => {
    const id = Array.isArray(newVal) ? Number(newVal[0]) : Number(newVal as any);
    selectedCategory.value = Number.isFinite(id) ? id : null;
    pagination.value.page = 1;
    await loadPage();
  }
);
</script>
