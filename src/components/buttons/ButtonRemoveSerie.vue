<template>
    <v-tooltip v-if="exists" text="Supprimer la série" :location="tooltipLocation">
        <template v-slot:activator="{ props }">
            <v-btn v-bind="props" color="surface-variant" elevation="0" :icon="DELETE_ICON" variant="text"
                @click="confirmModal = true" />
        </template>
    </v-tooltip>
</template>

<script lang="ts" setup>
import { useState } from '@/composables/state';
import { useSerie } from '@/composables/serie';
import { DELETE_ICON } from '@/constants/icons';
import { TOOLTIP_LOCATION } from '@/constants/style';
import type { Serie } from '@/models/serie';
import { onBeforeMount, ref, type PropType } from 'vue';

const props = defineProps({
    serie: { type: Object as PropType<Serie>, required: true },
    tooltipLocation: { type: String as PropType<"left" | "bottom">, default: TOOLTIP_LOCATION }
});

const { getSerieFromCache } = useSerie();
const { confirmModal } = useState();

const exists = ref(false);

onBeforeMount(async () => {
    exists.value = !!(await getSerieFromCache(props.serie.id));
});
</script>