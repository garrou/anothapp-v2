<template>
    <v-container class="text-center">
        <v-form v-model="valid" @submit="updateEmail" @submit.prevent>

            <v-text-field v-model="email" label="Nouvel email" required :rules="emailRules" suffix="@xyz.com" />

            <v-text-field v-model="confirmEmail" label="Confirmation de l'email" required
                :rules="[...emailRules, emailsMatchRule(email)]" suffix="@xyz.com" />

            <v-text-field v-model="password" label="Mot de passe actuel" required :rules="passwordRules"
                type="password" />

            <v-btn block class="my-5" color="primary" rounded="pill" :disabled="!valid" text="Sauvegarder"
                type="submit" />
        </v-form>
    </v-container>
</template>

<script lang="ts" setup>
import { useUser } from "@/composables/user";
import { emailRules, emailsMatchRule, passwordRules } from "@/utils/validator";
import { ref } from "vue";

const emit = defineEmits<{
    refresh: []
}>();

const { changeEmail } = useUser();

const valid = ref(false);
const email = ref("");
const confirmEmail = ref("");
const password = ref("");

const updateEmail = async () => {
    // see RegisterView.vue's createAccount for why this guard is needed
    if (!valid.value) return;
    await changeEmail(email.value, confirmEmail.value, password.value);
    emit("refresh");
}
</script>