<template>
    <v-snackbar v-if="message" v-model="snackbar" :color="message.color" variant="elevated" :vertical="false">
        <div class="text-subtitle-1 pb-2">{{ message.subject }}</div>

        <p>{{ message.message }}</p>

        <template #actions>
            <v-btn color="text-white" variant="text" @click="snackbar = false">Ok</v-btn>
        </template>
    </v-snackbar>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";
import { useSnackbarStore } from "@/stores/snackbar";
import { storeToRefs } from "pinia";

const { message } = storeToRefs(useSnackbarStore());
const snackbar = ref(false);

watch(message, () => {
    snackbar.value = true;
});
</script>