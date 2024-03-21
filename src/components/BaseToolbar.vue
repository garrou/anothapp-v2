<template>
    <v-toolbar color="white" density="compact">
        <v-app-bar-nav-icon @click="$emit('back')">
            <v-icon>mdi-chevron-left</v-icon>
        </v-app-bar-nav-icon>

        <v-toolbar-title>{{ title }}</v-toolbar-title>

        <slot name="firstBtn" />

        <slot name="secondBtn" />

        <template v-slot:extension>
            <slot name="tabs" />
        </template>
    </v-toolbar>
</template>

<script lang="ts" setup>
defineProps({
    title: { type: String, required: true }
})

defineEmits<{
    "back": [],
}>();
</script>