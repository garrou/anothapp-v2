<template>
    <div class="stat-tile">
        <v-icon v-if="icon" :icon="icon" size="16" class="stat-icon" />
        <div class="stat-value">{{ value }}</div>
        <div class="stat-label">{{ label }}</div>
    </div>
</template>

<script lang="ts" setup>
defineProps({
    icon: { type: String, default: undefined },
    label: { type: String, required: true },
    value: { type: [String, Number], required: true }
});
</script>

<style scoped>
.stat-icon {
    color: rgb(var(--v-theme-on-surface-variant));
    margin-bottom: 4px;
}

.stat-value {
    font-family: "Space Grotesk", sans-serif;
    font-size: 20px;
    font-weight: 700;
}

.stat-label {
    font-size: 12.5px;
    color: rgb(var(--v-theme-on-surface-variant));
}
</style>
