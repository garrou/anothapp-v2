<template>
    <v-menu :open-on-click="openOnClick" :open-on-hover="openOnHover">
        <template v-slot:activator="{ props }">
            <v-btn icon="mdi-dots-vertical" v-bind="props"></v-btn>
        </template>

        <v-list>
            <v-list-item>
                <div>
                    <slot name="default" />
                </div>
            </v-list-item>
        </v-list>
    </v-menu>
</template>

<script lang="ts" setup>
defineProps({
    openOnClick: { type: Boolean, default: false },
    openOnHover: { type: Boolean, default: false },
});
</script>