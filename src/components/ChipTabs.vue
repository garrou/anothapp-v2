<template>
    <div class="pill-tabs">
        <button v-for="item in tabs" :key="item.value" type="button" class="pill-tab"
            :class="{ 'pill-tab--active': modelValue === item.value }" @click="$emit('update:modelValue', item.value)">
            {{ item.label }}
            <v-badge v-if="item.badge" :content="item.badge" color="error" inline />
        </button>
    </div>
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
    display: flex;
    flex-wrap: nowrap;
    gap: 4px;
    overflow-x: auto;
    scrollbar-width: none;
    -ms-overflow-style: none;
}

.pill-tabs::-webkit-scrollbar {
    display: none;
}

.pill-tab {
    display: inline-flex;
    flex-shrink: 0;
    align-items: center;
    gap: 6px;
    border: none;
    background: transparent;
    cursor: pointer;
    border-radius: 999px;
    padding: 7px 18px;
    font-weight: 600;
    font-size: 13.5px;
    color: rgb(var(--v-theme-on-surface-variant));
    transition: background 0.15s ease, color 0.15s ease;
}

.pill-tab:hover {
    background: rgb(var(--v-theme-surface-variant));
}

.pill-tab--active {
    background: rgba(var(--v-theme-primary), 0.12);
    color: rgb(var(--v-theme-primary));
}
</style>
