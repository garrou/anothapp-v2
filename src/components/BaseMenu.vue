<template>
    <v-menu :open-on-click="openOnClick" :open-on-hover="openOnHover">
        <template v-slot:activator="{ props }">
            <v-btn icon="mdi-dots-vertical" variant="text" v-bind="props"></v-btn>
        </template>

        <v-list density="compact" min-width="200" nav>
            <slot name="default" />
        </v-list>
    </v-menu>
</template>

<script lang="ts" setup>
defineProps({
    openOnClick: { type: Boolean, default: false },
    openOnHover: { type: Boolean, default: false },
});
</script>