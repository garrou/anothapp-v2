<template>
    <div class="playlist-cover" :class="`covers-${posters.length}`">
        <template v-if="posters.length">
            <v-img v-for="(poster, index) in posters" :key="index" class="cover-tile" :src="poster" cover />
        </template>
        <div v-else class="cover-placeholder">
            <v-icon :icon="PLAYLIST_PLAY_ICON" size="40" />
        </div>
    </div>
</template>

<script lang="ts" setup>
import { PLAYLIST_PLAY_ICON } from "@/constants/icons";
import { type PropType } from "vue";

defineProps({
    posters: { type: Array as PropType<string[]>, default: () => [] }
});
</script>

<style scoped>
.playlist-cover {
    aspect-ratio: 1;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr;
    overflow: hidden;
    border-radius: 8px 8px 0 0;
    background: rgb(var(--v-theme-surface-variant));
}

.covers-1 .cover-tile {
    grid-column: 1 / 3;
    grid-row: 1 / 3;
}

.covers-2 .cover-tile {
    grid-row: 1 / 3;
}

.covers-3 .cover-tile:first-child {
    grid-column: 1 / 3;
}

.cover-tile {
    height: 100%;
    width: 100%;
}

.cover-placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    color: rgb(var(--v-theme-on-surface-variant));
}
</style>
