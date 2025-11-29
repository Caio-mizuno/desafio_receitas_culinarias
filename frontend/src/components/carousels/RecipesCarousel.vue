<template>
  <Carousel :items-to-show="items.length" :wrap-around="true" :autoplay="3000" class="">
    <Slide v-for="recipe in items" :key="recipe.id">
      <RecipeCard
        style="width: 95%"
        :recipe="recipe"
        :categoryName="getCategoryName(recipe.categoriaId)"
        @view="$emit('open', $event)"
      />
    </Slide>

    <template #addons>
      <Navigation />
      <Pagination />
    </template>
  </Carousel>
</template>

<script setup lang="ts">
import "vue3-carousel/carousel.css";
import { Carousel, Slide, Pagination, Navigation } from "vue3-carousel";
import RecipeCard from "@/components/cards/RecipeCard.vue";
import type { Recipe } from "@/types/recipe.types";

defineProps<{ items: Recipe[]; getCategoryName: (id: number) => string }>();
defineEmits<{ (e: "open", id: number): void }>();
</script>
