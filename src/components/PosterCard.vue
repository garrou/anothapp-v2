<template>
    <v-card class="poster-card" @click="$emit('click')">
        <div class="poster-media">
            <router-link v-if="to" :to="to" @click.stop>
                <base-image v-if="image" cover max-height="580" :src="image" />
                <div v-else class="poster-placeholder">
                    <v-icon size="40" icon="mdi-image-off-outline" />
                </div>
            </router-link>
            <template v-else>
                <base-image v-if="image" cover max-height="580" :src="image" />
                <div v-else class="poster-placeholder">
                    <v-icon size="40" icon="mdi-image-off-outline" />
                </div>
            </template>

            <div v-if="$slots['quick-actions']" class="quick-actions" @click.stop>
                <slot name="quick-actions" />
            </div>
        </div>

        <slot />

        <v-card-actions v-if="$slots.actions" @click.stop>
            <slot name="actions" />
        </v-card-actions>
    </v-card>
</template>

<script lang="ts" setup>
import BaseImage from "./BaseImage.vue";

defineProps({
    image: { type: String, default: undefined },
    to: { type: String, default: undefined },
});

defineEmits<{
    click: []
}>();
</script>

<style scoped>
.poster-card {
    transition: transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease;
}

.poster-card:hover {
    transform: translateY(-4px);
    border-color: rgb(var(--v-theme-primary)) !important;
    box-shadow: 0 16px 32px rgba(76, 60, 150, 0.16);
}

.poster-media {
    position: relative;
}

.quick-actions {
    position: absolute;
    top: 8px;
    right: 8px;
    z-index: 1;
    display: flex;
    flex-direction: column;
    gap: 6px;
}
</style>
