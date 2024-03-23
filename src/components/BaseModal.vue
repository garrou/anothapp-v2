<template>
    <v-dialog class="overflow-auto" :max-width="maxWidth" :persistent="persistent">
        <template #default>
            <slot name="default" />
        </template>
    </v-dialog>
</template>

<script lang="ts" setup>
defineProps({
    maxWidth: { type: Number, default: 1200 },
    persistent: { type: Boolean, default: false },
});
</script>