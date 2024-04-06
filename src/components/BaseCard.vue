<template>
    <v-card :elevation="ELEVATION" :text="text" :title="title">
        <slot name="image" />

        <template #title>
            <slot name="title" />
        </template>

        <v-card-subtitle class="pt-4">
            <slot name="subtitle" />
        </v-card-subtitle>

        <template #text>
            <slot name="text" />
        </template>

        <v-card-item>
            <slot name="item" />
        </v-card-item>

        <v-card-actions>
            <slot name="actions" />
        </v-card-actions>
    </v-card>
</template>

<script lang="ts" setup>
import { ELEVATION } from "@/constants/style";

defineProps({
    text: { type: String, default: undefined },
    title: { type: String, default: undefined },
})
</script>