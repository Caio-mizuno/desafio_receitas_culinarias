<template>
  <v-container fluid class="fill-height">
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card elevation="8" class="pa-6">
          <v-card-title class="text-center mb-4">
            <v-icon size="48" color="primary" class="mb-2">mdi-chef-hat</v-icon>
            <h1 class="text-h4 font-weight-bold">Receitas Culinárias</h1>
            <p class="text-subtitle-1 text-grey">Entre para gerenciar suas receitas</p>
          </v-card-title>

          <v-form @submit.prevent="handleLogin" ref="formRef">
            <v-text-field
              v-model="credentials.login"
              label="Login"
              prepend-inner-icon="mdi-account"
              variant="outlined"
              :rules="[v => !!v || 'Login é obrigatório']"
              required
              class="mb-4"
            />

            <v-text-field
              v-model="credentials.senha"
              label="Senha"
              prepend-inner-icon="mdi-lock"
              variant="outlined"
              type="password"
              :rules="[v => !!v || 'Senha é obrigatória']"
              required
              class="mb-4"
            />

            <v-alert
              v-if="authStore.error"
              type="error"
              variant="tonal"
              closable
              @click:close="authStore.clearError"
              class="mb-4"
            >
              {{ authStore.error }}
            </v-alert>

            <v-btn
              type="submit"
              color="primary"
              size="large"
              block
              :loading="authStore.loading"
              :disabled="authStore.loading"
              class="mb-4"
            >
              Entrar
            </v-btn>
          </v-form>

          <v-divider class="my-4" />

          <v-card-text class="text-center text-grey">
            <p class="text-caption">
              Use login: admin / senha: admin para testar
            </p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import type { LoginCredentials } from '@/types/auth.types'

const router = useRouter()
const authStore = useAuthStore()
const formRef = ref()

const credentials = reactive<LoginCredentials>({
  login: '',
  senha: ''
})

const handleLogin = async () => {
  const { valid } = await formRef.value.validate()
  if (!valid) return

  const result = await authStore.login(credentials)
  if (result.success) {
    router.push('/')
  }
}
</script>

<style scoped>
.fill-height {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f5f5 0%, #e8f5e9 100%);
}
</style>
