<template>
    <v-list-item v-if="serie.description && menuItem" :prepend-icon="DETAILS_ICON" title="Voir les détails"
        @click="modal = true" />

    <v-tooltip v-else-if="serie.description" text="Voir les détails" :location="tooltipLocation">
        <template v-slot:activator="{ props }">
            <v-btn v-bind="props" color="on-surface-variant" :icon="DETAILS_ICON" variant="text" @click="modal = true" />
        </template>
    </v-tooltip>

    <base-modal v-model="modal" :title="serie.title">
        <serie-detail :serie="serie" />
    </base-modal>
</template>

<script lang="ts" setup>
import BaseModal from '@/components/BaseModal.vue';
import SerieDetail from '@/components/series/SerieDetail.vue';
import { DETAILS_ICON } from '@/constants/icons';
import { TOOLTIP_LOCATION } from '@/constants/style';
import type { Serie } from '@/models/serie';
import { ref, type PropType } from 'vue';

defineProps({
    menuItem: { type: Boolean, default: false },
    serie: { type: Object as PropType<Serie>, required: true },
    tooltipLocation: { type: String as PropType<"left" | "bottom">, default: TOOLTIP_LOCATION }
});

const modal = ref(false);
</script>