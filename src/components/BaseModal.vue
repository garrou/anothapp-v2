<template>
    <v-dialog class="overflow-auto" :max-width="maxWidth" :persistent="persistent">
        <v-card>
            <v-card-title class="d-flex justify-space-between">
                <slot name="title" />
            </v-card-title>
            <slot name="default" />
        </v-card>
    </v-dialog>
</template>

<script lang="ts" setup>
defineProps({
    maxWidth: { type: Number, default: 1200 },
    persistent: { type: Boolean, default: false },
});
</script>