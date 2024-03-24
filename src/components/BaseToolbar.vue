<template>
    <v-toolbar color="white">
        <v-app-bar-nav-icon v-if="icon" @click="$emit('back')">
            <v-icon>{{ icon }}</v-icon>
        </v-app-bar-nav-icon>

        <v-toolbar-title>{{ title }}</v-toolbar-title>

        <slot name="firstBtn" />

        <slot name="secondBtn" />
    </v-toolbar>
</template>

<script lang="ts" setup>
import type { DENSITY } from "@/constants/style";

defineProps({
    icon: { type: String, required: true },
    title: { type: String, required: true }
});
</script>