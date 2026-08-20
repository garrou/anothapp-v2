<template>
    <div class="auth-page">
        <div class="auth-glow"></div>

        <v-container class="d-flex align-center justify-center" style="min-height: 100vh">
            <v-card class="pa-8" width="100%" max-width="420">
                <div class="text-center mb-6">
                    <h1 class="text-h5 font-weight-bold">{{ TITLE }}</h1>
                    <p class="text-body-2 text-medium-emphasis mt-1">Retrouvez le fil de vos séries.</p>
                </div>

                <v-form v-model="valid" @submit="authenticate" @submit.prevent>
                    <v-text-field v-model="identifier" label="Username ou email" required />

                    <v-text-field v-model="password" label="Mot de passe" required type="password" />

                    <v-btn block class="mt-2 mb-4" color="primary" rounded="pill" :disabled="!valid" :text="TITLE"
                        type="submit" />

                    <div class="text-center">
                        <router-link text="Pas de compte ? S'inscrire" to="/register" />
                    </div>
                </v-form>
            </v-card>
        </v-container>
    </div>
</template>
<script lang="ts" setup>
import { useAuth } from "@/composables/auth";
import { ref } from "vue";

const TITLE = "Se connecter";

const { login } = useAuth();

const valid = ref(false);
const identifier = ref("");
const password = ref("");

const authenticate = async () => {
    await login(identifier.value, password.value);
}
</script>

<style scoped>
.auth-page {
    position: relative;
    overflow: hidden;
}

.auth-glow {
    position: absolute;
    top: -260px;
    left: 50%;
    transform: translateX(-50%);
    width: 900px;
    height: 620px;
    max-width: 150vw;
    background: radial-gradient(closest-side, rgba(var(--v-theme-primary), 0.1), rgba(var(--v-theme-primary), 0) 70%);
    pointer-events: none;
}
</style>
