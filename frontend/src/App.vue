<template>
  <v-app>
    <AppBar v-if="!route.meta.hideAppBar" />
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import AppBar from '@/components/AppBar.vue'
import { useRoute } from 'vue-router'
const route = useRoute()
</script>
