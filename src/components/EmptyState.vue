<template>
    <div class="empty-state">
        <icon-badge :icon="icon" :size="64" />
        <h3 class="empty-state-title">{{ title }}</h3>
        <p v-if="description" class="empty-state-text">{{ description }}</p>
        <div v-if="$slots.default" class="empty-state-action">
            <slot />
        </div>
    </div>
</template>

<script lang="ts" setup>
import IconBadge from "./IconBadge.vue";

defineProps({
    description: { type: String, default: undefined },
    icon: { type: String, required: true },
    title: { type: String, required: true },
});
</script>

<style scoped>
.empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: var(--sp-2, 8px);
    padding: var(--sp-12, 48px) var(--sp-4, 16px);
}

.empty-state-title {
    font-family: "Space Grotesk", sans-serif;
    font-size: 16px;
    font-weight: 700;
}

.empty-state-text {
    margin: 0;
    font-size: 13px;
    line-height: 1.5;
    color: rgb(var(--v-theme-on-surface-variant));
    max-width: 34ch;
}

.empty-state-action {
    margin-top: var(--sp-2, 8px);
}
</style>
