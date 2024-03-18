<template>
    <v-btn :block="block" :color="color" :disabled="disabled" :icon="icon" :size="size" :text="text" :to="href" :type="type" />
</template>

<script lang="ts" setup>
import type { ButtonType } from "@/types/base-button";
import type { PropType } from "vue";

defineProps({
    block: { type: Boolean, default: false },
    color: { type: String, default: undefined },
    disabled: { type: Boolean, default: false },
    href: { type: String, default: undefined },
    icon: { type: String, default: undefined },
    size: { type: String, default: undefined },
    text: { type: String, default: undefined },
    type: { type: String as PropType<ButtonType>, default: "button" },
    variant: { type: String, default: "elevated" }
});
</script>