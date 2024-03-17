<template>
    <v-form v-model="valid" @submit="login" @submit.prevent>
        <v-container class="text-center">
            <h1>{{ TITLE }}</h1>
            <v-row>
                <v-col cols="12">
                    <base-text-field v-model="email" label="E-mail" :model="email" required :rules="emailRules" />
                </v-col>
                <v-col cols="12">
                    <base-text-field v-model="password" :counter="true" label="Mot de passe" :model="password" required
                        :rules="passwordRules" type="password" />
                </v-col>
                <v-col cols="12">
                    <base-button block :disabled="!valid" :text="TITLE" type="submit" />
                </v-col>
            </v-row>
            <base-link text="Pas de compte ? S'inscrire" to="/register" />
        </v-container>
        <base-alert v-if="displayError" :text="error" />
    </v-form>
</template>
<script lang="ts" setup>
import BaseAlert from "@/components/BaseAlert.vue";
import BaseButton from "@/components/BaseButton.vue";
import BaseLink from "@/components/BaseLink.vue";
import BaseTextField from "@/components/BaseTextField.vue";
import storageService from "@/services/storageService";
import userService from "@/services/userService";
import { computed, ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const TITLE = "Se connecter";

const valid = ref(false);
const email = ref("");
const password = ref("");
const error = ref("");

const displayError = computed(() => error.value.length > 0);

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

const login = async () => {
    const resp = await userService.login(email.value, password.value);

    if (resp.status === 200) {
        storageService.storeJwt((await resp.json()).token);
        router.replace("/series");
    } else {
        error.value = (await resp.json()).message;
    }
}
</script>