<template>
    <v-container class="text-center">
        <v-form v-model="valid" @submit="updatePassword" @submit.prevent>

            <v-text-field v-model="current" label="Mot de passe actuel" required :rules="passwordRules"
                type="password" variant="underlined" />

            <v-text-field v-model="password" counter label="Nouveau mot de passe" required :rules="passwordRules"
                type="password" variant="underlined" />

            <v-text-field v-model="confirmPassword" counter label="Confirmer le mot de passe" required
                :rules="passwordRules" type="password" variant="underlined" />

            <v-btn block class="my-5" :disabled="!valid" text="Sauvegarder" type="submit" />
        </v-form>
    </v-container>
</template>

<script lang="ts" setup>
import { useUser } from '@/composables/user';
import { passwordRules } from '@/utils/validator';
import { ref } from 'vue';

const emit = defineEmits<{
    refresh: []
}>();

const { changePassword } = useUser();

const valid = ref(false);
const current = ref("");
const password = ref("");
const confirmPassword = ref("");

const updatePassword = async () => {
    await changePassword(current.value, password.value, confirmPassword.value);
    emit("refresh");
}
</script>