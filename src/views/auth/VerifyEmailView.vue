<template>
    <div class="auth-page">
        <div class="auth-glow"></div>

        <v-container class="d-flex align-center justify-center" style="min-height: 100vh">
            <v-card class="pa-8 text-center" width="100%" max-width="420">
                <template v-if="loading">
                    <v-progress-circular indeterminate color="primary" class="mb-4" />
                    <p class="text-body-2 text-medium-emphasis">Confirmation de votre email en cours…</p>
                </template>

                <template v-else-if="success">
                    <h1 class="text-h5 font-weight-bold mb-2">Email confirmé</h1>
                    <p class="text-body-2 text-medium-emphasis mb-4">Vous pouvez désormais vous connecter.</p>
                    <v-btn block color="primary" rounded="pill" text="Se connecter" to="/login" />
                </template>

                <template v-else>
                    <h1 class="text-h5 font-weight-bold mb-2">Échec de la confirmation</h1>
                    <p class="text-body-2 text-medium-emphasis mb-4">{{ error }}</p>
                    <v-text-field v-model="email" label="Email" class="text-start" :disabled="resendLoading" />
                    <v-btn block class="mb-3" color="primary" rounded="pill" :disabled="!email"
                        :loading="resendLoading" text="Renvoyer l'email de confirmation" @click="resend" />
                    <router-link text="Retour à la connexion" to="/login" />
                </template>
            </v-card>
        </v-container>
    </div>
</template>

<script lang="ts" setup>
import { useAuth } from "@/composables/auth";
import { onBeforeMount, ref } from "vue";

const props = defineProps<{ token: string }>();

const { verifyEmail, resendVerification } = useAuth();

const loading = ref(true);
const success = ref(false);
const error = ref("");
const email = ref("");
const resendLoading = ref(false);

onBeforeMount(async () => {
    try {
        await verifyEmail(props.token);
        success.value = true;
    } catch (e) {
        error.value = (e as Error).message;
    } finally {
        loading.value = false;
    }
});

const resend = async () => {
    resendLoading.value = true;

    try {
        await resendVerification(email.value);
    } catch (e) {
        error.value = (e as Error).message;
    } finally {
        resendLoading.value = false;
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
