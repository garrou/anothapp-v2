<template>
    <v-container class="text-center">
        <v-form v-model="valid" @submit="createAccount" @submit.prevent>

            <h1>{{ TITLE }}</h1>

            <v-text-field v-model="username" counter label="Username" required :rules="nameRules"
                variant="underlined" />

            <v-text-field v-model="email" label="Email" required :rules="emailRules" suffix="@xyz.com"
                variant="underlined" />

            <v-text-field v-model="password" counter label="Mot de passe" required :rules="passwordRules"
                type="password" variant="underlined" />

            <v-text-field v-model="confirmPassword" counter label="Confirmer le mot de passe" required
                :rules="passwordRules" type="password" variant="underlined" />

            <v-btn block class="my-5" :disabled="!valid" :text="TITLE" type="submit" />

            <router-link text="Déjà membre ? Se connecter" to="/login" />
        </v-form>
    </v-container>
</template>

<script lang="ts" setup>
import { useUser } from "@/composables/user";
import { emailRules, nameRules, passwordRules } from "@/utils/validator";
import { ref } from "vue";

const TITLE = "S'inscrire";

const { register } = useUser();

const valid = ref(false);
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const username = ref("");

const createAccount = async () => {
    await register(email.value, password.value, confirmPassword.value, username.value);
}
</script>