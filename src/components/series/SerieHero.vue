<template>
    <div class="hero" :style="heroStyle">
        <div class="hero-scrim"></div>
        <v-btn class="back-btn" icon="mdi-chevron-left" variant="flat" density="comfortable" @click="$emit('back')" />
        <div class="hero-content">
            <div v-if="kinds.length" class="hero-tags">
                <span v-for="kind in kinds" :key="kind" class="tag">{{ kind }}</span>
            </div>
            <h1 class="hero-title">{{ title }}</h1>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { computed, type PropType } from "vue";

const props = defineProps({
    kinds: { type: Array as PropType<string[]>, default: () => [] },
    poster: { type: String, default: undefined },
    title: { type: String, required: true },
});

defineEmits<{
    back: []
}>();

const heroStyle = computed(() => props.poster ? { backgroundImage: `url(${props.poster})` } : {});
</script>

<style scoped>
.hero {
    position: relative;
    height: 320px;
    background-color: rgb(var(--v-theme-surface));
    background-size: cover;
    background-position: center 20%;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding: 24px 24px 28px;
}

.hero-scrim {
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, rgba(10, 8, 16, 0.1) 0%, rgba(10, 8, 16, 0.55) 65%, rgba(10, 8, 16, 0.88) 100%);
}

.back-btn {
    position: relative;
    z-index: 1;
    background: rgba(10, 8, 16, 0.5) !important;
    margin-bottom: auto;
    align-self: flex-start;
}

.hero-content {
    position: relative;
    z-index: 1;
}

.hero-tags {
    display: flex;
    gap: 8px;
    margin-bottom: 10px;
}

.tag {
    font-size: 11.5px;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.85);
    background: rgba(255, 255, 255, 0.12);
    border-radius: 999px;
    padding: 4px 11px;
}

.hero-title {
    font-size: 32px;
    font-weight: 700;
    letter-spacing: -0.015em;
    color: #fff;
    text-shadow: 0 2px 16px rgba(0, 0, 0, 0.4);
}
</style>
