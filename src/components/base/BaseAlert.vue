<template>
    <v-alert :border="border" :border-color="borderColor" :text="text" :title="title" :type="type" />
</template>

<script lang="ts" setup>
import type { BaseAlertBorder, BaseAlertType } from "@/types/base-alert";
import type { PropType } from "vue";

defineProps({
    border:  { type: String as PropType<BaseAlertBorder>, default: undefined },
    borderColor:  { type: String, default: undefined },
    text: { type: String, required: true },
    title: { type: String, default: "Erreur" },
    type: { type: String as PropType<BaseAlertType>, default: "error" },
});
</script>