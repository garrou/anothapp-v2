<template>
    <v-tooltip v-if="serie.description" text="Voir les détails" :location="tooltipLocation">
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
    serie: { type: Object as PropType<Serie>, required: true },
    tooltipLocation: { type: String as PropType<"left" | "bottom">, default: TOOLTIP_LOCATION }
});

const modal = ref(false);
</script>