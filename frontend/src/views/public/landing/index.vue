<template>
  <div>
    <!-- <v-sheet color="transparent" class="hero-section"> -->
    <v-container class="py-12">
      <v-row align="center">
        <v-col cols="12" class="hero-banner">
          <v-img
            src="https://www.receiteria.com.br/wp-content/uploads/brioche-simples-730x480.jpeg"
            cover
            height="480"
            class="rounded-lg"
          >
            <div class="hero-overlay d-flex align-end pa-8">
              <div>
                <h1 class="text-h2 font-weight-bold mb-4 text-white">
                  Descubra novas receitas
                </h1>
                <p class="text-subtitle-1 text-white mb-6">
                  Inspire-se com as últimas criações da comunidade e encontre sua próxima
                  refeição favorita.
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
                  <v-btn
                    variant="text"
                    color="primary"
                    @click="goToRecipes"
                    :ripple="false"
                    >Ver todas</v-btn
                  ></span
                >
              </h2>
            </div>
            <v-skeleton-loader v-if="categoryLoading" type="card, card, card" />
            <v-row v-else>
              <v-col
                cols="12"
                sm="6"
                md="4"
                lg="3"
                v-for="r in categoryRecipes"
                :key="r.id"
              >
                <v-card class="rounded-lg w-80" hover @click="goToRecipe(r.id)">
                  <v-card-title class="text-subtitle-1 font-weight-bold">
                    {{ r.nome }}
                  </v-card-title>
                  <v-card-text>
                    Tempo de preparo:
                    <v-chip size="small" color="secondary" variant="tonal">
                      {{ r.tempoPreparoMinutos }} min
                    </v-chip>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-col>
        </v-col>
      </v-row>
    </v-container>
    <!-- </v-sheet> -->

    <v-container>
      <v-row>
        <v-col cols="12">
          <div class="d-flex align-center justify-space-between mb-4">
            <h2 class="text-h4 font-weight-bold">Últimas receitas</h2>
            <v-btn variant="text" color="primary" @click="goToRecipes">Ver todas</v-btn>
          </div>

          <v-skeleton-loader v-if="loading" type="image, article" class="mb-6" />

          <v-carousel
            v-else
            class="carousel-container"
            hide-delimiter-background
            height="380"
            show-arrows="always"
          >
            <v-carousel-item v-for="recipe in latestRecipes" :key="recipe.id">
              <v-card class="rounded-xl overflow-hidden carousel-card" hover>
                <div class="carousel-margin">
                  <!-- Title -->
                  <v-row class="d-flex align-center gap-1 mt-8">
                    <v-col cols="12">
                      <v-title class="text-h5 font-weight-bold">
                        {{ recipe.nome }}
                      </v-title>
                    </v-col>
                    <v-col cols="12">
                      <v-chip size="small" color="primary" class="mr-2">
                        {{ getCategoryName(recipe.categoriaId) }}
                      </v-chip>
                      <v-chip size="small" color="secondary" variant="tonal">
                        {{ recipe.porcoes }} porções •
                        {{ recipe.tempoPreparoMinutos }} min
                      </v-chip>
                    </v-col>
                  </v-row>
                  <!-- Body -->
                  <v-card-text>
                    <div class="text-truncate-2 text-grey-darken-1">
                      {{ recipe.ingredientes }}
                    </div>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer />
                    <v-btn
                      color="primary"
                      @click="goToRecipe(recipe.id)"
                      variant="elevated"
                      >Ver Receita</v-btn
                    >
                  </v-card-actions>
                </div>
              </v-card>
            </v-carousel-item>
          </v-carousel>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useRecipeStore } from "@/stores/recipe.store";
import { useCategoryStore } from "@/stores/category.store";
import { useAuthStore } from "@/stores/auth.store";
import apiClient from "@/plugins/axios";
import { MockService } from "@/services/mock.service";
import type { Recipe } from "@/types/recipe.types";

const router = useRouter();
const recipeStore = useRecipeStore();
const categoryStore = useCategoryStore();
const authStore = useAuthStore();

const canCreate = computed(() => authStore.isAuthenticated);
const loading = ref(false);
const categoryLoading = ref(false);
const selectedCategoryId = ref<number | null>(null);
const categoryRecipes = ref<Recipe[]>([]);

const latestRecipes = computed(() => {
  const list = [...recipeStore.recipes];
  list.sort((a, b) => {
    const da = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const db = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return db - da;
  });
  return list.slice(0, 5);
});

const topCategories = computed(() => {
  return categoryStore.categories.slice(0, 6);
});

const getCategoryName = (categoriaId: number) => {
  const c = categoryStore.categories.find((c) => c.id === categoriaId);
  return c?.nome || "Sem Categoria";
};

const goToRecipes = () => router.push("/receitas");
const goToCreate = () => router.push("/minhas-receitas/nova");
const goToRecipe = (id: number) => router.push(`/receitas/${id}`);

const selectCategory = async (id: number) => {
  selectedCategoryId.value = id;
  categoryLoading.value = true;
  try {
    const resp = await apiClient.get("/recipes", {
      params: { categoriaId: id, limit: 5 },
    });
    categoryRecipes.value = resp.data.response || [];
  } catch (err: any) {
    const fallback = await MockService.getRecipes({ categoriaId: id });
    categoryRecipes.value = fallback.response.slice(0, 5);
  } finally {
    categoryLoading.value = false;
  }
};

onMounted(async () => {
  loading.value = true;
  await Promise.all([recipeStore.fetchRecipes(), categoryStore.fetchCategories()]);
  loading.value = false;
});
</script>

<style scoped>
.hero-banner {
  position: relative;
}
.hero-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: flex-end;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.55) 100%);
}
.hero-section {
  background: linear-gradient(135deg, #fff 0%, #fff 40%, #f5f7fb 100%);
}
.img-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.55) 100%);
}
.text-truncate-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.carousel-margin {
  margin: 0 2rem;
}

.carousel-card {
  width: 60%;
  margin: 0 auto;
}
@media (max-width: 600px) {
  .carousel-card {
    width: 80%;
    margin: 0 auto;
  }
}
.carousel-container {
  overflow: visible;
}
.carousel-container :deep(.v-window__container) {
  overflow: visible;
}
.carousel-container :deep(.v-window__controls) {
  z-index: 5;
}
.active-chip {
  background-color: rgba(33, 150, 243, 0.15);
}

.chip-mg-3 {
  margin: 0.5rem;
}
</style>
