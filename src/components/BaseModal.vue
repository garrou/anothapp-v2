<template>
    <v-dialog class="overflow-auto" :model-value="modelValue" :max-width="maxWidth" :persistent="persistent" scrollable
        @update:model-value="$emit('update:modelValue', $event)">
        <v-card>
            <v-card-title class="d-flex justify-space-between align-center pb-0">
                <slot name="title">
                    <span v-if="title">{{ title }}</span>
                    <v-spacer v-else />
                    <v-btn :icon="CLOSE_ICON" variant="text" @click="$emit('update:modelValue', false)" />
                </slot>
            </v-card-title>
            <v-card-text class="pt-0">
                <slot name="default" />
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script lang="ts" setup>
import { CLOSE_ICON } from "@/constants/icons";

defineProps({
    maxWidth: { type: Number, default: 1200 },
    modelValue: { type: Boolean, default: false },
    persistent: { type: Boolean, default: false },
    title: { type: String, default: undefined },
});

defineEmits<{
    "update:modelValue": [boolean]
}>();
</script>