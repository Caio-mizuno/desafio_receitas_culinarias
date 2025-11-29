<template>
  <v-app-bar color="primary" elevation="4" prominent>
    <v-app-bar-nav-icon @click="drawer = !drawer" />

    <v-app-bar-title>
      <div  class="d-inline-flex ">
        <div><v-icon class="mr-2">mdi-chef-hat</v-icon></div>
        <div class="font-weight-bold align-self-center">Receitas Culinárias</div>
      </div>
    </v-app-bar-title>

    <template v-if="authStore.isAuthenticated">
      <v-tabs v-model="activeTab" bg-color="primary" class="ml-4" density="comfortable">
        <v-tab value="minhas" @click="goToMyRecipes">
          <v-icon start>mdi-book-outline</v-icon>
          Minhas Receitas
        </v-tab>
        <v-tab value="perfil" @click="goToProfile">
          <v-icon start>mdi-account-outline</v-icon>
          Perfil
        </v-tab>
      </v-tabs>

      <v-spacer />

      <v-menu location="bottom">
        <template #activator="{ props }">
          <v-btn v-bind="props" icon variant="text">
            <v-avatar color="secondary" size="32">
              <v-icon>mdi-account</v-icon>
            </v-avatar>
          </v-btn>
        </template>

        <v-card min-width="200">
          <v-card-text class="text-center pb-2">
            <v-avatar color="secondary" size="48" class="mb-2">
              <v-icon size="24">mdi-account</v-icon>
            </v-avatar>
            <div class="text-subtitle-1 font-weight-medium">
              {{ authStore.user?.login || "Usuário" }}
            </div>
          </v-card-text>

          <v-divider />

          <v-list density="compact">
            <v-list-item
              prepend-icon="mdi-account-outline"
              title="Meu Perfil"
              @click="goToProfile"
            />
            <v-list-item
              prepend-icon="mdi-book-outline"
              title="Minhas Receitas"
              @click="goToMyRecipes"
            />
          </v-list>

          <v-divider />

          <v-card-actions>
            <v-btn
              color="error"
              variant="text"
              block
              @click="handleLogout"
              :loading="authStore.loading"
            >
              <v-icon start>mdi-logout</v-icon>
              Sair
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-menu>
    </template>
    <template v-else>
      <v-spacer />
      <v-btn color="white" variant="text" @click="goToLogin">
        <v-icon start>mdi-login</v-icon>
        Entrar
      </v-btn>
    </template>
  </v-app-bar>

  <!-- Navigation Drawer -->
  <v-navigation-drawer v-model="drawer" temporary location="start">
    <v-list>
      <v-list-item prepend-icon="mdi-home-outline" title="Home" @click="goToHome" />
      <v-list-item
        prepend-icon="mdi-book-outline"
        title="Receitas"
        @click="goToRecipes"
      />
      <v-list-item
        prepend-icon="mdi-tag-outline"
        title="Categorias"
        @click="goToCategories"
      />

      <v-divider />

      <v-list-item
        v-if="authStore.isAuthenticated"
        prepend-icon="mdi-book-plus-outline"
        title="Minhas Receitas"
        @click="goToMyRecipes"
      />
    </v-list>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth.store";

const router = useRouter();
const authStore = useAuthStore();

const drawer = ref(false);
const activeTab = ref("");

const goToHome = () => {
  drawer.value = false;
  router.push("/");
};

const goToRecipes = () => {
  drawer.value = false;
  router.push("/receitas");
};

const goToCategories = () => {
  drawer.value = false;
  router.push("/categorias");
};

const goToMyRecipes = () => {
  drawer.value = false;
  router.push("/minhas-receitas");
};

const goToProfile = () => {
  router.push("/perfil");
};

const goToLogin = () => {
  router.push("/login");
};

const handleLogout = async () => {
  await authStore.logout();
  router.push("/");
};

const goToCreateRecipe = () => {
  drawer.value = false;
  router.push("/minhas-receitas/nova");
};
</script>
