<template>
    <v-container class="d-flex flex-column justify-center text-center" style="height: 100vh">
        <v-form v-model="valid" @submit="authenticate" @submit.prevent>

            <h1>{{ TITLE }}</h1>

            <v-text-field v-model="identifier" label="Username ou email" required variant="underlined" />

            <v-text-field v-model="password" label="Mot de passe" required type="password" variant="underlined" />

            <v-btn block class="my-5" :disabled="!valid" :text="TITLE" type="submit" />

            <router-link text="Pas de compte ? S'inscrire" to="/register" />
        </v-form>
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