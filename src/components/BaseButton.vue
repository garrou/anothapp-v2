<template>
    <v-btn :block="block" class="mt-2" :disabled="disabled" :type="type">{{ text }}</v-btn>
</template>

<script lang="ts" setup>
import type { ButtonType } from "@/types/base-button";
import type { PropType } from "vue";

defineProps({
    block: { type: Boolean, default: true },
    disabled: { type: Boolean, default: false },
    text: { type: String, required: true },
    type: { type: String as PropType<ButtonType>, default: "button" },
    variant: { type: String, default: "elevated" }
})
</script>