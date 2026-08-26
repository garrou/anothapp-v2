<template>
    <v-tabs class="pill-tabs" :model-value="modelValue" density="comfortable" hide-slider
        @update:model-value="$emit('update:modelValue', $event)">
        <v-tab v-for="item in tabs" :key="item.value" class="pill-tab" :value="item.value">
            {{ item.label }}
            <v-badge v-if="item.badge" :content="item.badge" color="error" inline />
        </v-tab>
    </v-tabs>
</template>

<script lang="ts" setup>
import type { PropType } from "vue";

interface TabItem {
    value: number;
    label: string;
    badge?: number;
}

defineProps({
    modelValue: { type: Number, required: true },
    tabs: { type: Array as PropType<TabItem[]>, required: true }
});

defineEmits<{
    "update:modelValue": [number]
}>();
</script>

<style scoped>
.pill-tabs {
    background: transparent;
    mask-image: linear-gradient(to right, black calc(100% - 28px), transparent 100%);
    -webkit-mask-image: linear-gradient(to right, black calc(100% - 28px), transparent 100%);
}

.pill-tab {
    border-radius: 999px;
    min-width: unset;
    margin-right: 6px;
    padding: 0 18px;
    text-transform: none;
    font-weight: 600;
    font-size: 13.5px;
    letter-spacing: normal;
    color: rgb(var(--v-theme-on-surface-variant));
    transition: background 0.15s ease, color 0.15s ease;
}

.pill-tab.v-tab--selected {
    background: rgba(var(--v-theme-primary), 0.12);
    color: rgb(var(--v-theme-primary));
}

@media screen and (max-width: 420px) {
    .pill-tab {
        margin-right: 2px;
        padding: 0 12px;
        font-size: 13px;
    }
}
</style>
