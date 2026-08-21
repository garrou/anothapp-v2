<template>
    <div class="day-badge" :class="{ 'day-badge--active': active }">
        <span class="day-badge-dow">{{ dow }}</span>
        <span class="day-badge-num">{{ day }}</span>
    </div>
</template>

<script lang="ts" setup>
defineProps({
    active: { type: Boolean, default: false },
    day: { type: Number, required: true },
    dow: { type: String, required: true },
});
</script>

<style scoped>
.day-badge {
    flex-shrink: 0;
    width: 48px;
    height: 48px;
    border-radius: 12px;
    background: rgb(var(--v-theme-surface-variant));
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    line-height: 1.1;
}

.day-badge--active {
    background: rgb(var(--v-theme-primary));
}

.day-badge--active .day-badge-dow,
.day-badge--active .day-badge-num {
    color: #fff;
}

.day-badge-dow {
    font-size: 9px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.03em;
    color: rgb(var(--v-theme-on-surface-variant));
}

.day-badge-num {
    font-family: "Space Grotesk", sans-serif;
    font-size: 18px;
    font-weight: 700;
    color: rgb(var(--v-theme-on-surface));
}
</style>
