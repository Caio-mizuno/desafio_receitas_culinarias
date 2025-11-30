<template>
  <v-card elevation="3">
    <v-img
      height="200"
      :src="`foods/${recipe.categoriaId}.jpg`"
      cover
      class="align-end"
    >
      <div class="w-100 d-inline-flex justify-center">
        <v-chip variant="elevated" color="primary" class="ma-2 w-80" size="small">
          <v-icon size="16" color="white" class="mr-1">mdi-tag</v-icon>
          {{ categoryName }}
        </v-chip>
      </div>
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

      <div class="text-truncate text-caption text-grey">
        {{ recipe.ingredientes }}
      </div>
    </v-card-text>

    <v-card-actions>
      <v-spacer />
      <v-btn
        color="primary"
        variant="text"
        prepend-icon="mdi-pencil"
        @click.stop="$emit('edit', recipe.id)"
      >Editar</v-btn>
      <v-btn
        color="error"
        variant="text"
        prepend-icon="mdi-delete"
        :loading="deleteLoading"
        @click.stop="$emit('delete', recipe)"
      >Excluir</v-btn>
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
}

const props = defineProps<{ recipe: Recipe; categoryName: string; deleteLoading?: boolean }>();
defineEmits<{ (e: 'edit', id: number): void; (e: 'delete', recipe: Recipe): void }>();
</script>

