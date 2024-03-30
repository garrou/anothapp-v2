<template>
    <v-form v-model="valid" @submit="createAccount" @submit.prevent>
        <v-container class="text-center">
            <h1>{{ TITLE }}</h1>
            <v-row class="mb-2">
                <v-col cols="12">
                    <v-text-field v-model="username" counter label="Username" required :rules="nameRules" variant="underlined" />
                </v-col>
                <v-col cols="12">
                    <v-text-field v-model="email" label="E-mail" required :rules="emailRules" suffix="@xyz.com"
                        variant="underlined" />
                </v-col>
                <v-col cols="12">
                    <v-text-field v-model="password" counter label="Mot de passe" required
                        :rules="passwordRules" type="password" variant="underlined" />
                </v-col>
                <v-col cols="12">
                    <v-text-field v-model="confirmPassword" counter label="Confirmer le mot de passe" required
                        :rules="passwordRules" type="password" variant="underlined" />
                </v-col>
                <v-col cols="12">
                    <v-btn block :disabled="!valid" :text="TITLE" type="submit" />
                </v-col>
            </v-row>
            <router-link text="Déjà membre ? Se connecter" to="/login" />
        </v-container>
    </v-form>
</template>

<script lang="ts" setup>
import { useUser } from "@/composables/user";
import { EMAIL_PATTERN, MAX_PASSWORD, MAX_USERNAME, MIN_PASSWORD, MIN_USERNAME, PASSWORD_PATTERN, USERNAME_PATTERN } from "@/constants/auth";
import { ref } from "vue";

const TITLE = "S'inscrire";

const { register } = useUser();

const valid = ref(false);
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const username = ref("");

const nameRules = [
    (value?: string) => {
        if (value) return true;
        return "Username requis";
    },
    (value: string) => {
        if (USERNAME_PATTERN.test(value)) return true;
        return `Le username doit être valide (${MIN_USERNAME} - ${MAX_USERNAME}) sans '@'`;
    }
]

const emailRules = [
    (value?: string) => {
        if (value) return true;
        return "Email requis";
    },
    (value: string) => {
        if (EMAIL_PATTERN.test(value)) return true;
        return "L'email doit être valide";
    }
];

const passwordRules = [
    (value?: string) => {
        if (value) return true;
        return "Un mot de passe est requis.";
    },
    (value: string) => {
        if (PASSWORD_PATTERN.test(value)) return true;
        return `Le mot de passe doit être valide (${MIN_PASSWORD} - ${MAX_PASSWORD})`;
    },
    () => password.value === confirmPassword.value
];

const createAccount = async () => {
    await register(email.value, password.value, confirmPassword.value, username.value);
}
</script>