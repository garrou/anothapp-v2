<template>
    <div class="actor-detail">
        <div v-if="actor.poster" class="preview-img">
            <base-image :src="actor.poster" />
        </div>
        <div class="detail-content">
            <div class="meta-line">
                <template v-if="actor.birthday">
                    <span class="meta-item">
                        <v-icon size="14" icon="mdi-cake-variant-outline" />
                        {{ actor.birthday }}
                    </span>
                </template>
                <template v-if="actor.deathday">
                    <span v-if="actor.birthday" class="dot">•</span>
                    <span class="meta-item">
                        <v-icon size="14" icon="mdi-flower-outline" />
                        {{ actor.deathday }}
                    </span>
                </template>
                <template v-if="actor.nationality">
                    <span v-if="actor.birthday || actor.deathday" class="dot">•</span>
                    <span>{{ actor.nationality }}</span>
                </template>
            </div>

            <div v-if="actor.description" class="detail-section">
                <div class="section-label">Description</div>
                <p class="section-text">{{ actor.description }}</p>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import BaseImage from '@/components/BaseImage.vue';
import type { Actor } from '@/models/person';
import type { PropType } from 'vue';

defineProps({
    actor: { type: Object as PropType<Actor>, required: true }
});
</script>

<style scoped>
.actor-detail {
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding: 8px;
}

.preview-img {
    width: 180px;
    align-self: flex-start;

    @media screen and (max-width: 600px) {
        display: none;
    }
}

.detail-content {
    width: 100%;
}

.meta-line {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    color: rgb(var(--v-theme-on-surface-variant));
    margin-bottom: 20px;
}

.meta-item {
    display: inline-flex;
    align-items: center;
    gap: 4px;
}

.dot {
    opacity: 0.5;
}

.detail-section {
    margin-bottom: 12px;
}

.section-label {
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: rgb(var(--v-theme-on-surface-variant));
    margin-bottom: 6px;
}

.section-text {
    margin: 0;
    font-size: 14.5px;
    line-height: 1.6;
}
</style>
