<template>
    <div class="icon-badge" :style="{ width: `${size}px`, height: `${size}px` }">
        <v-icon :size="size * 0.45" color="primary">{{ icon }}</v-icon>
    </div>
</template>

<script lang="ts" setup>
defineProps({
    icon: { type: String, required: true },
    size: { type: Number, default: 60 }
});
</script>

<style scoped>
.icon-badge {
    border-radius: 16px;
    background: rgba(var(--v-theme-primary), 0.12);
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>
