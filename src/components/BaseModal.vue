<template>
    <v-dialog class="overflow-auto" :model-value="modelValue" :max-width="maxWidth" :persistent="persistent" scrollable
        :fullscreen="fullscreenOnMobile && display.mobile.value" :aria-label="title"
        @update:model-value="$emit('update:modelValue', $event)">
        <v-card>
            <v-card-title class="d-flex justify-space-between align-center pb-0">
                <slot name="title">
                    <span v-if="title">{{ title }}</span>
                    <v-spacer v-else />
                    <v-btn :icon="CLOSE_ICON" aria-label="Fermer" variant="text" @click="$emit('update:modelValue', false)" />
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
import { useDisplay } from "vuetify";

defineProps({
    maxWidth: { type: Number, default: 1200 },
    modelValue: { type: Boolean, default: false },
    persistent: { type: Boolean, default: false },
    title: { type: String, default: undefined },
    // Opt-in: most modals in the app are short (a confirmation, a form) and
    // stay comfortable as a centered dialog even on a phone. This is for the
    // few that hold genuinely deep, scrollable content (e.g. a season's
    // episode list), where a capped dialog height on top of that content's
    // own nesting leaves barely any room to read it.
    fullscreenOnMobile: { type: Boolean, default: false },
});

defineEmits<{
    "update:modelValue": [boolean]
}>();

const display = useDisplay();
</script>