<template>
    <v-snackbar v-model="snackbar" color="success" variant="elevated" :vertical="false">
        <div class="text-subtitle-1 pb-2">{{ subject }}</div>

        <p>{{ message }}</p>

        <template v-slot:actions>
            <v-btn color="text-white" variant="text" @click="snackbar = false">Ok</v-btn>
        </template>
    </v-snackbar>
</template>

<script lang="ts" setup>
import { useSnackbarStore } from "@/stores/snackbar";
import { storeToRefs } from "pinia";
import { ref, watch } from "vue";

const snackBarStore = useSnackbarStore();
const { message, subject } = storeToRefs(snackBarStore);
const snackbar = ref(false);

watch(message, () => {
    snackbar.value = true;
})
</script>