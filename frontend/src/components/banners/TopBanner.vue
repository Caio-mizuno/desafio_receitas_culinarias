<template>
  <v-img :src="src" :cover="cover" :height="height" class="rounded-lg" :gradient="gradient">
    <div class="text-overlay d-flex align-end pa-8">
      <div>
        <h1 class="text-h2 font-weight-bold mb-4 text-white">{{ title }}</h1>
        <p class="text-h5 text-white mb-6">{{ subtitle }}</p>
      </div>
    </div>
  </v-img>
</template>

<script setup lang="ts">
interface Props {
  src?: string
  title?: string
  subtitle?: string
  height?: string | number
  gradient?: string
  cover?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  src: '/banner4.jpg',
  title: 'O que você quer cozinhar hoje?',
  subtitle: 'Inspire-se e coloque a mão na massa agora!',
  height: 480,
  gradient: 'to top, rgba(0,0,0,.8), rgba(0,0,0,0)',
  cover: true,
})

const { src, title, subtitle, height, gradient, cover } = props
</script>

<style scoped>
.text-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: flex-end;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.55) 100%);
}
</style>
