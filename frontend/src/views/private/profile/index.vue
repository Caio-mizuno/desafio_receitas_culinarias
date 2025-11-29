<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1 class="text-h3 font-weight-bold mb-6">Meu Perfil</h1>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="6">
        <v-card elevation="4">
          <v-card-title>
            <v-icon start>mdi-account-outline</v-icon>
            Informações do Usuário
          </v-card-title>

          <v-card-text>
            <v-list>
              <v-list-item>
                <template #prepend>
                  <v-icon color="primary">mdi-account</v-icon>
                </template>
                <v-list-item-title>Nome</v-list-item-title>
                <v-list-item-subtitle>{{ authStore.user?.nome || 'Não informado' }}</v-list-item-subtitle>
              </v-list-item>

              <v-list-item>
                <template #prepend>
                  <v-icon color="primary">mdi-login-variant</v-icon>
                </template>
                <v-list-item-title>Login</v-list-item-title>
                <v-list-item-subtitle>{{ authStore.user?.login || 'Não informado' }}</v-list-item-subtitle>
              </v-list-item>

              <v-list-item>
                <template #prepend>
                  <v-icon color="primary">mdi-calendar-outline</v-icon>
                </template>
                <v-list-item-title>Membro desde</v-list-item-title>
                <v-list-item-subtitle>{{ formatDate(authStore.user?.criadoEm) || 'Não informado' }}</v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card elevation="4">
          <v-card-title>
            <v-icon start>mdi-book-outline</v-icon>
            Estatísticas
          </v-card-title>

          <v-card-text>
            <v-row>
              <v-col cols="6" class="text-center">
                <v-icon size="48" color="primary" class="mb-2">mdi-chef-hat</v-icon>
                <div class="text-h4">{{ authStore.user?.receitasCriadas ?? 0 }}</div>
                <div class="text-caption text-grey">Receitas Criadas</div>
              </v-col>
              <v-col cols="6" class="text-center">
                <v-icon size="48" color="secondary" class="mb-2">mdi-tag-outline</v-icon>
                <div class="text-h4">{{ authStore.user?.categoriasUtilizadas ?? 0 }}</div>
                <div class="text-caption text-grey">Categorias</div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row class="mt-6">
      <v-col cols="12">
        <v-card elevation="4">
          <v-card-title>
            <v-icon start>mdi-cog-outline</v-icon>
            Configurações
          </v-card-title>

          <v-card-text>
            <v-list>
              <v-list-item prepend-icon="mdi-book-outline" title="Minhas Receitas" subtitle="Gerenciar suas receitas" @click="goToMyRecipes" link />
              <v-list-item prepend-icon="mdi-plus-circle-outline" title="Criar Nova Receita" subtitle="Adicionar uma nova receita" @click="goToCreateRecipe" link />
              <v-divider />
              <v-list-item prepend-icon="mdi-logout" title="Sair" subtitle="Encerrar sessão" @click="handleLogout" link />
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'

const router = useRouter()
const authStore = useAuthStore()

const formatDate = (dateString?: string) => {
  if (!dateString) return null
  return new Date(dateString).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  })
}

const goToMyRecipes = () => {
  router.push('/minhas-receitas')
}

const goToCreateRecipe = () => {
  router.push('/minhas-receitas/nova')
}

const handleLogout = async () => {
  await authStore.logout()
  router.push('/')
}

onMounted(async () => {
  await authStore.fetchProfile()
})
</script>
