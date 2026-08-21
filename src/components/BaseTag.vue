<template>
    <span class="base-tag" :class="`base-tag--${variant}`">
        <slot />
    </span>
</template>

<script lang="ts" setup>
import type { PropType } from "vue";

defineProps({
    variant: { type: String as PropType<"neutral" | "selected" | "on-image">, default: "neutral" }
});
</script>

<style scoped>
.base-tag {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: 11.5px;
    font-weight: 600;
    line-height: 1;
    padding: 5px 10px;
    border-radius: 999px;
    white-space: nowrap;
}

.base-tag--neutral {
    color: rgb(var(--v-theme-primary));
    background: rgba(var(--v-theme-primary), 0.12);
}

.base-tag--selected {
    color: #fff;
    background: rgb(var(--v-theme-primary));
}

.base-tag--on-image {
    color: rgba(255, 255, 255, 0.9);
    background: rgba(255, 255, 255, 0.14);
}
</style>
