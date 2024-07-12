<template>
    <v-dialog class="overflow-auto" :max-width="maxWidth" :persistent="persistent" scrollable>
        <v-card>
            <v-card-title class="d-flex justify-space-between pb-0">
                    <slot name="title" />      
            </v-card-title>
            <v-card-text class="pt-0">
                <slot name="default" />
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script lang="ts" setup>
defineProps({
    maxWidth: { type: Number, default: 1200 },
    persistent: { type: Boolean, default: false },
});
</script>