<template>
    <v-card :hover="hover" :href="href" :loading="loading" :subtitle="subtitle" :text="text" :title="title" :width="width" />
</template>

<script lang="ts" setup>
import type { BaseCardVariant } from "@/types/base-card";
import type { PropType } from "vue";

defineProps({
    hover: { type: Boolean, default: true },
    href: { type: String, default: undefined },
    loading:  { type: Boolean, default: false },
    subtitle: { type: String, required: false },
    text: { type: String, required: false },
    title: { type: String, required: false },
    variant: { type: String as PropType<BaseCardVariant>, default: "elevated" },
    width: { type: Number, required: false },
});
</script>