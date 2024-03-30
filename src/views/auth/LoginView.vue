<template>
    <v-form v-model="valid" @submit="authenticate" @submit.prevent>
        <v-container class="text-center">
            <h1>{{ TITLE }}</h1>
            <v-row class="mb-2">
                <v-col cols="12">
                    <v-text-field v-model="identifier" label="Username ou email" required :rules="idRules" variant="underlined" />
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
const identifier = ref("");
const password = ref("");

const idRules = [
    (value?: string) => {
        if (value) return true;
        return "Le username ou l'email est requis";
    }
];

const passwordRules = [
    (value?: string) => {
        if (value) return true;
        return "Le mot de passe est requis";
    }
];

const authenticate = async () => {
    await login(identifier.value, password.value);
}
</script>