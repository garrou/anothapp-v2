<template>
    <v-list-item v-if="serie.addedAt && menuItem" :prepend-icon="EDIT_ICON" title="Modifier la date d'ajout"
        @click="$emit('update')" />

    <v-tooltip v-else-if="serie.addedAt" text="Modifier la série" :location="tooltipLocation">
        <template v-slot:activator="{ props }">
            <v-btn v-bind="props" :color="MAIN_COLOR" :icon="EDIT_ICON" variant="text" @click="$emit('update')" />
        </template>
    </v-tooltip>
</template>

<script lang="ts" setup>
import { EDIT_ICON } from '@/constants/icons';
import { TOOLTIP_LOCATION, MAIN_COLOR } from '@/constants/style';
import type { Serie } from '@/models/serie';
import { type PropType } from 'vue';

defineProps({
    menuItem: { type: Boolean, default: false },
    serie: { type: Object as PropType<Serie>, required: true },
    tooltipLocation: { type: String as PropType<"left" | "bottom">, default: TOOLTIP_LOCATION }
});
</script>