<template>
    <v-form v-model="valid" @submit="authenticate" @submit.prevent>
        <v-container class="text-center">
            <h1>{{ TITLE }}</h1>
            <v-row>
                <v-col cols="12">
                    <v-text-field v-model="email" label="E-mail" required :rules="emailRules" variant="underlined" />
                </v-col>
                <v-col cols="12">
                    <v-text-field v-model="password" :counter="true" label="Mot de passe" required
                        :rules="passwordRules" type="password" variant="underlined" />
                </v-col>
                <v-col cols="12">
                    <v-btn block :disabled="!valid" :text="TITLE" type="submit" />
                </v-col>
            </v-row>
            <router-link text="Pas de compte ? S'inscrire" to="/register" />
        </v-container>
    </v-form>
</template>
<script lang="ts" setup>
import { useUser } from "@/composables/user";
import { ref } from "vue";

const TITLE = "Se connecter";

const { login } = useUser();

const valid = ref(false);
const email = ref("");
const password = ref("");

// TODO username

const emailRules = [
    (value?: string) => {
        if (value) return true
        return "L'email est requis."
    },
    (value?: string) => {
        if (value && /.+@.+\..+/.test(value)) return true
        return "L'email doit être valide."
    }
];

const passwordRules = [
    (value?: string) => {
        if (value) return true
        return "Le mot de passe est requis."
    },
    (value?: string) => {
        if (value && value?.length >= 8) return true
        return "Le mot de passe doit contenir au moins 8 caractères."
    }
];

const authenticate = async () => {
    await login(email.value, password.value);
}
</script>