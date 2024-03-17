<template>
    <v-snackbar v-model="model"  :location="location" :timeout="timeout">{{ text }}</v-snackbar>
</template>

<script lang="ts" setup>
import type { BaseSnackbarLocation } from "@/types/base-snackbar";
import type { PropType } from "vue";

defineProps({
    location: { type: String as PropType<BaseSnackbarLocation>, default: "bottom" },
    text: { type: String, required: true },
    timeout: { type: Number, default: 2000 },
})

const model = defineModel({ type: Boolean });
</script>