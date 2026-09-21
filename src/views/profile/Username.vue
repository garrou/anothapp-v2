<template>
    <v-container class="text-center">
        <v-form v-model="valid" @submit="updateUsername" @submit.prevent>

            <v-text-field v-model="username" label="Nouveau nom d'utilisateur" required :rules="nameRules" />

            <v-text-field v-model="confirmUsername" label="Confirmation du nom d'utilisateur" required
                :rules="[...nameRules, usernamesMatchRule(username)]" />

            <v-text-field v-model="password" label="Mot de passe" required :rules="passwordRules"
                type="password" />

            <v-btn block class="my-5" color="primary" rounded="pill" :disabled="!valid" text="Sauvegarder"
                type="submit" />
        </v-form>
    </v-container>
</template>

<script lang="ts" setup>
import { useUser } from "@/composables/user";
import { nameRules, passwordRules, usernamesMatchRule } from "@/utils/validator";
import { ref } from "vue";

const emit = defineEmits<{
    refresh: []
}>();

const { changeUsername } = useUser();

const valid = ref(false);
const username = ref("");
const confirmUsername = ref("");
const password = ref("");

const updateUsername = async () => {
    // see RegisterView.vue's createAccount for why this guard is needed
    if (!valid.value) return;
    await changeUsername(username.value, confirmUsername.value, password.value);
    emit("refresh");
}
</script>
