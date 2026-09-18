<template>
    <div class="auth-page">
        <div class="auth-glow"></div>

        <v-container class="d-flex align-center justify-center" style="min-height: 100vh">
            <v-card class="pa-8" width="100%" max-width="420">
                <div class="text-center mb-6">
                    <h1 class="text-h5 font-weight-bold">{{ TITLE }}</h1>
                    <p class="text-body-2 text-medium-emphasis mt-1">Choisissez votre nouveau mot de passe.</p>
                </div>

                <v-form v-model="valid" @submit="submit" @submit.prevent>
                    <v-text-field v-model="password" counter label="Nouveau mot de passe" required
                        :rules="passwordRules" type="password" :disabled="loading" />

                    <v-text-field v-model="confirmPassword" counter label="Confirmer le mot de passe" required
                        :rules="[...passwordRules, passwordsMatchRule(password)]" :error-messages="error"
                        :disabled="loading" />

                    <v-btn block class="mt-2 mb-4" color="primary" rounded="pill" :disabled="!valid || loading"
                        :loading="loading" :text="TITLE" type="submit" />

                    <div class="text-center">
                        <router-link text="Retour à la connexion" to="/login" />
                    </div>
                </v-form>
            </v-card>
        </v-container>
    </div>
</template>

<script lang="ts" setup>
import { useAuth } from "@/composables/auth";
import { passwordRules, passwordsMatchRule } from "@/utils/validator";
import { ref } from "vue";

const TITLE = "Réinitialiser le mot de passe";

const props = defineProps<{ token: string }>();

const { resetPassword } = useAuth();

const valid = ref(false);
const password = ref("");
const confirmPassword = ref("");
const loading = ref(false);
const error = ref("");

const submit = async () => {
    // see RegisterView.vue's createAccount for why this guard is needed
    if (!valid.value) return;
    loading.value = true;
    error.value = "";

    try {
        await resetPassword(props.token, password.value, confirmPassword.value);
    } catch (e) {
        error.value = (e as Error).message;
    } finally {
        loading.value = false;
    }
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
