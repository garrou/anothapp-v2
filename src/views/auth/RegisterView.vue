<template>
    <div class="auth-page">
        <div class="auth-glow"></div>

        <v-container class="d-flex align-center justify-center" style="min-height: 100vh">
            <v-card class="pa-8" width="100%" max-width="420">
                <div class="text-center mb-6">
                    <h1 class="text-h5 font-weight-bold">{{ TITLE }}</h1>
                    <p class="text-body-2 text-medium-emphasis mt-1">Créez votre compte pour commencer à suivre vos
                        séries.</p>
                </div>

                <v-form v-model="valid" @submit="createAccount" @submit.prevent>
                    <v-text-field v-model="username" counter label="Username" required :rules="nameRules" />

                    <v-text-field v-model="email" label="Email" required :rules="emailRules" />

                    <v-text-field v-model="password" counter label="Mot de passe" required :rules="passwordRules"
                        type="password" />

                    <v-text-field v-model="confirmPassword" counter label="Confirmer le mot de passe" required
                        :rules="passwordRules" type="password" />

                    <v-btn block class="mt-2 mb-4" color="primary" rounded="pill" :disabled="!valid" :text="TITLE"
                        type="submit" />

                    <div class="text-center">
                        <router-link text="Déjà membre ? Se connecter" to="/login" />
                    </div>
                </v-form>
            </v-card>
        </v-container>
    </div>
</template>

<script lang="ts" setup>
import { useAuth } from "@/composables/auth";
import { emailRules, nameRules, passwordRules } from "@/utils/validator";
import { ref } from "vue";

const TITLE = "S'inscrire";

const { register } = useAuth();

const valid = ref(false);
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const username = ref("");

const createAccount = async () => {
    await register(email.value, password.value, confirmPassword.value, username.value);
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
