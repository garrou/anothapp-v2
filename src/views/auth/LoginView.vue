<template>
    <v-container class="d-flex align-center justify-center" style="min-height: 100vh">
        <v-card class="pa-8" width="100%" max-width="420">
            <h1 class="text-h5 font-weight-bold text-center mb-6">{{ TITLE }}</h1>

            <v-form v-model="valid" @submit="authenticate" @submit.prevent>
                <v-text-field v-model="identifier" label="Username ou email" required />

                <v-text-field v-model="password" label="Mot de passe" required type="password" />

                <v-btn block class="mt-2 mb-4" color="primary" :disabled="!valid" :text="TITLE" type="submit" />

                <div class="text-center">
                    <router-link text="Pas de compte ? S'inscrire" to="/register" />
                </div>
            </v-form>
        </v-card>
    </v-container>
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