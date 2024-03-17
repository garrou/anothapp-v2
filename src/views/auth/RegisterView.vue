<template>
    <v-form v-model="valid" @submit.prevent>
        <v-container>
            <v-row>
                <v-col cols="12">
                    <base-text-field :counter="MAX_USERNAME_LENGTH" :hide-details="false" label="Nom d'utilisateur" :model="username"
                        required :rules="nameRules" />
                </v-col>
                <v-col cols="12">
                    <base-text-field label="E-mail" :model="email" required :rules="emailRules" suffix="@xyz.com" />
                </v-col>
                <v-col cols="12">
                    <base-text-field :counter="true" label="Mot de passe" :model="password" required
                        :rules="passwordRules" type="password" />
                </v-col>
                <v-col cols="12">
                    <base-button block class="mt-2" :disabled="!valid" text="S'inscrire" type="submit" />
                </v-col>
            </v-row>
        </v-container>
    </v-form>
</template>

<script lang="ts" setup>
import { ref } from "vue";

const MAX_USERNAME_LENGTH = 10;
const MIN_PASSWORD_LENGTH = 8;

const valid = ref(false);
const username = ref("");
const email = ref("");
const password = ref("");

const nameRules = [
    (value?: string) => {
        if (value) return true;
        return "Username requis.";
    },
    (value?: string) => {
        if (value && value?.length <= MAX_USERNAME_LENGTH) return true;
        return `Le username peut contenir maximum ${MAX_USERNAME_LENGTH} caractères.`;
    }
];

const emailRules = [
    (value?: string) => {
        if (value) return true;
        return "Email requis.";
    },
    (value?: string) => {
        if (value && /.+@.+\..+/.test(value)) return true;
        return "Email doit être valide.";
    }
];

const passwordRules = [
    (value?: string) => {
        if (value) return true;
        return "Un mot de passe est requis.";
    },
    (value?: string) => {
        if (value && value?.length >= MIN_PASSWORD_LENGTH) return true;
        return `Le mot de passe doit contenir au moins ${MIN_PASSWORD_LENGTH} caractères.`;
    }
];
</script>