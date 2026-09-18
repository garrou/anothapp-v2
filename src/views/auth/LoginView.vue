<template>
    <div class="auth-page">
        <div class="auth-glow"></div>

        <v-container class="d-flex align-center justify-center" style="min-height: 100vh">
            <v-card v-if="pendingApproval" class="pa-8" width="100%" max-width="420">
                <div class="text-center mb-6">
                    <h1 class="text-h5 font-weight-bold">Confirmez votre connexion</h1>
                    <p class="text-body-2 text-medium-emphasis mt-1">
                        Un code à 6 chiffres vous a été envoyé par email. Saisissez-le pour continuer.
                    </p>
                </div>

                <v-form v-model="codeValid" @submit="confirm" @submit.prevent>
                    <v-text-field v-model="code" label="Code de connexion" required maxlength="6"
                        :disabled="confirmLoading" />

                    <v-btn block class="mt-2 mb-4" color="primary" rounded="pill" :disabled="!codeValid || confirmLoading"
                        :loading="confirmLoading" text="Confirmer" type="submit" />

                    <div class="text-center">
                        <v-btn variant="text" text="Retour" @click="pendingApproval = null" />
                    </div>
                </v-form>
            </v-card>

            <v-card v-else-if="!pendingDeletion" class="pa-8" width="100%" max-width="420">
                <div class="text-center mb-6">
                    <h1 class="text-h5 font-weight-bold">{{ TITLE }}</h1>
                    <p class="text-body-2 text-medium-emphasis mt-1">Retrouvez le fil de vos séries.</p>
                </div>

                <v-form v-model="valid" @submit="authenticate" @submit.prevent>
                    <v-text-field v-model="identifier" label="Username ou email" required />

                    <v-text-field v-model="password" label="Mot de passe" required type="password" />

                    <v-btn block class="mt-2 mb-4" color="primary" rounded="pill" :disabled="!valid || loginLoading"
                        :loading="loginLoading" :text="TITLE" type="submit" />

                    <div class="d-flex flex-column ma-3 ga-2">
                        <div class="text-center">
                            <router-link text="Pas de compte ? S'inscrire" to="/register" />
                        </div>

                        <div class="text-center">
                            <router-link text="Mot de passe oublié ?" to="/forgot-password" />
                        </div>
                    </div>
                </v-form>
            </v-card>

            <v-card v-else class="pa-8" width="100%" max-width="420">
                <div class="text-center mb-6">
                    <h1 class="text-h5 font-weight-bold">Suppression en cours</h1>
                    <p class="text-body-2 text-medium-emphasis mt-1">
                        Votre compte est programmé pour suppression. Voulez-vous annuler et vous connecter ?
                    </p>
                </div>

                <v-btn block class="mb-3" color="primary" rounded="pill" :loading="cancelLoading"
                    text="Annuler la suppression et se connecter" @click="confirmCancelDeletion" />

                <p v-if="cancelError" class="text-error text-body-2 text-center mb-3">{{ cancelError }}</p>

                <v-btn block variant="text" text="Non, laisser mon compte être supprimé"
                    @click="pendingDeletion = null" />
            </v-card>
        </v-container>
    </div>
</template>
<script lang="ts" setup>
import { useAuth } from "@/composables/auth";
import { ref } from "vue";

const TITLE = "Se connecter";

const { login, confirmLogin, cancelDeletion } = useAuth();

const valid = ref(false);
const identifier = ref("");
const password = ref("");
const loginLoading = ref(false);
const pendingDeletion = ref<{ cancellationToken: string } | null>(null);
const cancelLoading = ref(false);
const cancelError = ref("");
const pendingApproval = ref<{ approvalToken: string } | null>(null);
const codeValid = ref(false);
const code = ref("");
const confirmLoading = ref(false);

const authenticate = async () => {
    loginLoading.value = true;

    try {
        const result = await login(identifier.value, password.value);

        if ("pendingDeletion" in result) {
            pendingDeletion.value = { cancellationToken: result.cancellationToken };
            return;
        }
        pendingApproval.value = { approvalToken: result.approvalToken };
    } finally {
        loginLoading.value = false;
    }
}

const confirm = async () => {
    if (!pendingApproval.value) return;
    confirmLoading.value = true;

    try {
        await confirmLogin(pendingApproval.value.approvalToken, code.value);
    } finally {
        confirmLoading.value = false;
    }
}

const confirmCancelDeletion = async () => {
    if (!pendingDeletion.value) return;
    cancelLoading.value = true;
    cancelError.value = "";

    try {
        await cancelDeletion(pendingDeletion.value.cancellationToken);
    } catch (e) {
        cancelError.value = (e as Error).message;
    } finally {
        cancelLoading.value = false;
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
