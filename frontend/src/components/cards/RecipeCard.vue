<template>
  <v-card hover elevation="3" class="recipe-card" @click="$emit('view', recipe.id)">
    <v-img
      height="200"
      :src="`foods/${recipe.categoriaId}.jpg`"
      cover
      class="align-end"
    >
      <div class="w-100 d-inline-flex justify-center">
        <v-chip variant="elevated" color="secondary" class="ma-2 w-80" size="small" >
          <v-icon size="16" color="white" class="mr-1">mdi-tag</v-icon>
          {{ categoryName }}
        </v-chip>
      </div>
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
      <v-btn color="primary" variant="text" @click.stop="$emit('view', recipe.id)">
        Ver Receita
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
interface Recipe {
  id: number;
  nome: string;
  tempoPreparoMinutos: number;
  porcoes: number;
  ingredientes: string;
  categoriaId: number;
  isCarousel?: boolean;
}

const props = defineProps<{ recipe: Recipe; categoryName: string }>();
defineEmits<{ (e: "view", id: number): void }>();
</script>
