<template>
    <v-form v-model="valid" @submit="login" @submit.prevent>
        <v-container>
            <v-row>
                <v-col cols="12">
                    <base-text-field label="E-mail" :model="email" required :rules="emailRules" />
                </v-col>
                <v-col cols="12">
                    <base-text-field :counter="true" label="Mot de passe" :model="password" required
                        :rules="passwordRules" type="password" />
                </v-col>
                <v-col cols="12">
                    <base-button block class="mt-2" :disabled="!valid" text="Se connecter" type="submit" />
                </v-col>
            </v-row>
        </v-container>
    </v-form>
</template>
<script lang="ts" setup>
import storageService from "@/services/storageService";
import userService from "@/services/userService";
import { computed, ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const valid = ref(false);
const email = ref("");
const password = ref("");
const error = ref("");

const displayError = computed(() => error.value.length > 0);

const emailRules = [
    (value?: string) => {
        if (value) return true
        return "Email requis."
    },
    (value?: string) => {
        if (value && /.+@.+\..+/.test(value)) return true
        return "Email doit être valide."
    }
];

const passwordRules = [
    (value?: string) => {
        if (value) return true
        return "Un mot de passe est requis."
    },
    (value?: string) => {
        if (value && value?.length >= 8) return true
        return "Le mot de passe doit contenir au moins 8 characters."
    }
];

const login = async () => {
    const resp = await userService.login(email.value, password.value);

    if (resp.status === 200) {
        storageService.storeJwt((await resp.json()).token);
        router.replace("/series");
    } else {
        error.value = (await resp.json()).message;
        console.log(error.value)
    }
}
</script>