<template>
  <v-container fluid class="fill-height pa-0 ">
    <v-row align="center" justify="center" width="100%">
      <v-col cols="12" sm="8" md="6" class="d-none d-md-block"
        ><v-img
          src="/image-login.jpg"
          alt="Imagem de receitas"
          cover
          class="rounded-lg"
          height="90vh"
        />
      </v-col>

      <v-divider class="d-none" /><v-divider
        vertical
        class="mx-1 d-none d-md-block"
      />

      <v-col cols="12" md="5" height="90vh">
        <v-card elevation="8" class="pa-6 align-content-center login-card" height="90vh">
          <div class="d-flex flex-column align-self-center">
            <div v-if="!isRegisterMode">
              <v-card-title class="text-center mb-4">
                <v-icon size="48" color="primary" class="mb-2">mdi-chef-hat</v-icon>
                <h1 class="text-h4 font-weight-bold">Receitas Culinárias</h1>
                <p class="text-subtitle-1 text-grey">Entre para gerenciar suas receitas</p>
              </v-card-title>

              <v-row align="stretch" class="mt-2">
                <v-col cols="12">
                  <v-form @submit.prevent="handleLogin" ref="formRef">
                    <v-text-field
                      v-model="credentials.login"
                      label="Login"
                      prepend-inner-icon="mdi-account"
                      variant="outlined"
                      :rules="[(v) => !!v || 'Login é obrigatório']"
                      required
                      class="mb-4"
                    />
                    <v-text-field
                      v-model="credentials.senha"
                      label="Senha"
                      prepend-inner-icon="mdi-lock"
                      variant="outlined"
                      type="password"
                      :rules="[(v) => !!v || 'Senha é obrigatória']"
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
                </v-col>
              </v-row>

              <v-divider class="my-4" />

              <v-card-text class="text-center text-grey">
                <p class="text-caption">Use login: admin / senha: admin para testar</p>
                <div class="mt-2">
                  <span class="text-subtitle-2">Não possui uma conta?</span>
                  <v-btn variant="outlined" color="primary" class="ml-2" @click="isRegisterMode = true"
                    >Cadastre-se</v-btn
                  >
                </div>
              </v-card-text>
            </div>

            <div v-else>
              <v-card-title class="text-center mb-4">
                <v-icon size="48" color="primary" class="mb-2">mdi-account-plus</v-icon>
                <h1 class="text-h4 font-weight-bold">Criar sua conta</h1>
                <p class="text-subtitle-1 text-grey">Junte-se para salvar e gerenciar receitas</p>
              </v-card-title>

              <v-form @submit.prevent="handleRegister" ref="registerFormRef">
                <v-text-field
                  v-model="registerForm.nome"
                  label="Nome"
                  prepend-inner-icon="mdi-account"
                  variant="outlined"
                  :rules="[v => !!v || 'Nome é obrigatório']"
                  required
                  class="mb-4"
                />

                <v-text-field
                  v-model="registerForm.login"
                  label="Login"
                  prepend-inner-icon="mdi-account-circle"
                  variant="outlined"
                  :rules="[v => !!v || 'Login é obrigatório']"
                  required
                  class="mb-4"
                />

                <v-text-field
                  v-model="registerForm.senha"
                  label="Senha"
                  prepend-inner-icon="mdi-lock"
                  variant="outlined"
                  type="password"
                  :rules="[v => !!v || 'Senha é obrigatória']"
                  required
                  class="mb-2"
                />

                <v-text-field
                  v-model="confirmSenha"
                  label="Confirmar senha"
                  prepend-inner-icon="mdi-lock-check"
                  variant="outlined"
                  type="password"
                  :rules="[v => v === registerForm.senha || 'As senhas não conferem']"
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
                  Cadastrar
                </v-btn>
              </v-form>

              <v-divider class="my-4" />

              <v-card-text class="text-center text-grey">
                <p class="text-subtitle-2 mb-2">Já tem uma conta?</p>
                <v-btn variant="outlined" color="primary" @click="isRegisterMode = false">Entrar</v-btn>
              </v-card-text>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth.store";
import type { LoginCredentials, RegisterCredentials } from "@/types/auth.types";
import "./styles.css";

const router = useRouter();
const authStore = useAuthStore();

const isRegisterMode = ref(false);

const formRef = ref();
const credentials = reactive<LoginCredentials>({
  login: "",
  senha: "",
});

const handleLogin = async () => {
  const { valid } = await formRef.value.validate();
  if (!valid) return;

  const result = await authStore.login(credentials);
  if (result.success) {
    router.push("/");
  }
};

const registerFormRef = ref();
const registerForm = reactive<RegisterCredentials>({
  nome: "",
  login: "",
  senha: "",
});
const confirmSenha = ref("");

const handleRegister = async () => {
  const { valid } = await registerFormRef.value.validate();
  if (!valid) return;

  const result = await authStore.register(registerForm);
  if (result.success) {
    router.push("/");
  }
};
</script>
