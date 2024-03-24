<template>
    <v-form v-model="valid" @submit="createAccount" @submit.prevent>
        <v-container class="text-center">
            <h1>{{ TITLE }}</h1>
            <v-row>
                <v-col cols="12">
                    <v-text-field label="E-mail" :model="email" required :rules="emailRules" suffix="@xyz.com" variant="underlined" />
                </v-col>
                <v-col cols="12">
                    <v-text-field :counter="true" label="Mot de passe" :model="password" required
                        :rules="passwordRules" type="password" variant="underlined" />
                </v-col>
                <v-col cols="12">
                    <v-text-field :counter="true" label="Confirmer le mot de passe" :model="confirmPassword" required
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
import { EMAIL_PATTERN, MIN_PASSWORD_LENGTH } from "@/constants/auth";
import { ref } from "vue";

const TITLE = "S'inscrire";

const { register } = useUser();

const valid = ref(false);
const email = ref("");
const password = ref("");
const confirmPassword = ref("");

const emailRules = [
    (value?: string) => {
        if (value) return true;
        return "Email requis.";
    },
    (value: string) => {
        if (EMAIL_PATTERN.test(value)) return true;
        return "Email doit être valide.";
    }
];

const passwordRules = [
    (value?: string) => {
        if (value) return true;
        return "Un mot de passe est requis.";
    },
    (value: string) => {
        if (value.length >= MIN_PASSWORD_LENGTH) return true;
        return `Le mot de passe doit contenir au moins ${MIN_PASSWORD_LENGTH} caractères.`;
    },
    () => {
        return password.value === confirmPassword.value;
    }
];

const createAccount = async () => {
    await register(email.value, password.value, confirmPassword.value);
}
</script>