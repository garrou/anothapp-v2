<template>
    <v-card class="info-list">
        <template v-for="(card, index) in visibleCards" :key="index">
            <div class="info-row">
                <div class="info-label">{{ card.name }}</div>

                <div v-if="card.format === 'array'" class="info-array">
                    <div v-for="v in card.value" :key="v.name" class="info-array-item">
                        <platform-card :platform="v" />
                        <span class="text-caption text-center">{{ v.name }}</span>
                    </div>
                </div>
                <p v-else class="info-value">{{ card.value }}</p>
            </div>
            <v-divider v-if="index < visibleCards.length - 1" />
        </template>
    </v-card>
</template>

<script lang="ts" setup>
import { computed, type PropType } from "vue";
import type { Layout } from "@/models/layout";
import PlatformCard from "@/components/series/PlatformCard.vue";

const props = defineProps({
    cards: { type: Array as PropType<Layout[]>, required: true }
});

const visibleCards = computed(() => props.cards.filter((card) => card.display !== false));
</script>

<style scoped>
.info-row {
    padding: 14px 20px;
}

.info-label {
    margin-bottom: 4px;
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.02em;
    color: rgb(var(--v-theme-on-surface-variant));
}

.info-value {
    margin: 0;
    font-weight: 500;
}

.info-array {
    display: flex;
    flex-wrap: wrap;
    gap: 18px;
    margin-top: 6px;
}

.info-array-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    width: 64px;
}
</style>
