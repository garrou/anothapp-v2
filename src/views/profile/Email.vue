<template>
    <v-container class="text-center">
        <v-form v-model="valid" @submit="updateEmail" @submit.prevent>

            <v-text-field v-model="current" label="Email actuel" required :rules="emailRules" suffix="@xyz.com"
                variant="underlined" />

            <v-text-field v-model="email" label="Nouvel email" required :rules="emailRules" suffix="@xyz.com"
                variant="underlined" />

            <v-btn block class="my-5" :disabled="!valid" text="Sauvegarder" type="submit" />
        </v-form>
    </v-container>
</template>

<script lang="ts" setup>
import { useAuth } from "@/composables/auth";
import { emailRules } from "@/utils/validator";
import { ref } from "vue";

const emit = defineEmits<{
    refresh: []
}>();

const { changeEmail } = useAuth();

const valid = ref(false);
const current = ref("");
const email = ref("");

const updateEmail = async () => {
    await changeEmail(current.value, email.value);
    emit("refresh");
}
</script>