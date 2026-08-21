<template>
    <v-list-item v-if="serie.addedAt && menuItem" class="text-error" :prepend-icon="DELETE_ICON"
        title="Retirer la série" @click="confirmModal = true" />

    <v-tooltip v-else-if="serie.addedAt" text="Supprimer la série" :location="tooltipLocation">
        <template v-slot:activator="{ props }">
            <v-btn v-bind="props" :color="MAIN_COLOR" elevation="0" :icon="DELETE_ICON" variant="text"
                @click="confirmModal = true" />
        </template>
    </v-tooltip>
</template>

<script lang="ts" setup>
import { useState } from '@/composables/state';
import { DELETE_ICON } from '@/constants/icons';
import { TOOLTIP_LOCATION, MAIN_COLOR } from '@/constants/style';
import type { Serie } from '@/models/serie';
import { type PropType } from 'vue';

defineProps({
    menuItem: { type: Boolean, default: false },
    serie: { type: Object as PropType<Serie>, required: true },
    tooltipLocation: { type: String as PropType<"left" | "bottom">, default: TOOLTIP_LOCATION }
});

const { confirmModal } = useState();
</script>
