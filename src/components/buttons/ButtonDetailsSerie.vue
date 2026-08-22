<template>
    <v-list-item v-if="serie.addedAt && menuItem" prepend-icon="mdi-information" title="Page des détails"
        @click="$router.push(`/discover/${serie.id}`)" />

    <v-tooltip v-else-if="serie.addedAt" text="Page des détails" :location="tooltipLocation">
        <template v-slot:activator="{ props }">
            <v-btn v-bind="props" :color="MAIN_COLOR" elevation="0" icon="mdi-information" variant="text"
                @click="$router.push(`/discover/${serie.id}`)" />
        </template>
    </v-tooltip>
</template>

<script lang="ts" setup>
import { TOOLTIP_LOCATION, MAIN_COLOR } from '@/constants/style';
import type { Serie } from '@/models/serie';
import { type PropType } from 'vue';

defineProps({
    menuItem: { type: Boolean, default: false },
    serie: { type: Object as PropType<Serie>, required: true },
    tooltipLocation: { type: String as PropType<"left" | "bottom">, default: TOOLTIP_LOCATION }
});
</script>
