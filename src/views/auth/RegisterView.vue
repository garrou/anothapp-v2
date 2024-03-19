<template>
    <v-form v-model="valid" @submit="register" @submit.prevent>
        <v-container class="text-center">
            <h1>{{ TITLE }}</h1>
            <v-row>
                <v-col cols="12">
                    <v-text-field label="E-mail" :model="email" required :rules="emailRules" suffix="@xyz.com" />
                </v-col>
                <v-col cols="12">
                    <v-text-field :counter="true" label="Mot de passe" :model="password" required
                        :rules="passwordRules" type="password" />
                </v-col>
                <v-col cols="12">
                    <v-text-field :counter="true" label="Confirmer le mot de passe" :model="confirmPassword" required
                        :rules="passwordRules" type="password" />
                </v-col>
                <v-col cols="12">
                    <v-btn block :disabled="!valid" :text="TITLE" type="submit" />
                </v-col>
            </v-row>
            <router-link text="Déjà membre ? Se connecter" to="/login" />
        </v-container>
        <v-alert v-if="displayError" :text="error" />
    </v-form>
</template>

<script lang="ts" setup>
import userService from "@/services/userService";
import { computed, ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const TITLE = "S'inscrire";
const MIN_PASSWORD_LENGTH = 8;

const valid = ref(false);
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const error = ref("");

const displayError = computed(() => error.value.length > 0);

const emailRules = [
    (value?: string) => {
        if (value) return true;
        return "Email requis.";
    },
    (value: string) => {
        if (/.+@.+\..+/.test(value)) return true;
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

const register = async () => {
    const resp = await userService.register(email.value, password.value, confirmPassword.value);

    if (resp.status === 200) {
        router.push("/login");
    } else {
        error.value = (await resp.json()).message;
    }
}
</script>