<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <TopBanner
          src="/banner3.jpg"
          title="Todo tipo de delícia em um lugar só!"
          subtitle="Escolha uma categoria e descubra receitas incríveis"
          height="480"
          gradient="to top, rgba(0,0,0,.8), rgba(0,0,0,0)"
          :cover="true"
          class="mb-4"
        />


        <v-row v-if="categoryStore.loading">
          <v-col cols="12" sm="6" md="4" lg="3" v-for="n in 8" :key="n">
            <v-skeleton-loader type="card" />
          </v-col>
        </v-row>

        <v-row v-else-if="categories.length > 0">
          <v-col
            cols="12"
            sm="6"
            md="4"
            lg="3"
            v-for="category in categories"
            :key="category.id"
          >
            <v-card
              hover
              elevation="3"
              class="category-card"
              @click="filterByCategory(category.id)"
            >
              <v-card-text class="text-center pa-6">
                <v-icon size="48" color="primary" class="mb-4">mdi-tag-outline</v-icon>
                <v-card-title class="text-h6 mb-2">{{ category.nome }}</v-card-title>
                <div v-if="category.descricao" class="text-body-2 text-grey mb-4">
                  {{ category.descricao }}
                </div>
                <v-chip color="secondary" size="small"
                  >{{ category.receitasContagem }} receitas</v-chip
                >
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <v-row v-else>
          <v-col cols="12" class="text-center">
            <v-icon size="128" color="grey-lighten-2" class="mb-4"
              >mdi-tag-outline</v-icon
            >
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
import { computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useCategoryStore } from "@/stores/category.store";
import "./styles.css";
import TopBanner from "@/components/banners/TopBanner.vue";

const router = useRouter();
const categoryStore = useCategoryStore();

const categories = computed(() => categoryStore.categoriesCountRecipes);

const filterByCategory = (categoryId: number) => {
  router.push({ name: "recipes", query: { categoriaId: String(categoryId) } });
};

onMounted(async () => {
  await categoryStore.fetchCategoriesCount();
});
</script>
