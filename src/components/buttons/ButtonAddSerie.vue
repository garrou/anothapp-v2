<template>
    <v-tooltip v-if="!exists" text="Ajouter la série" :location="tooltipLocation">
        <template v-slot:activator="{ props }">
            <v-btn v-bind="props" :color="MAIN_COLOR" elevation="0" :icon="ADD_ICON" variant="text"
                @click="addSerie(serieId)" />
        </template>
    </v-tooltip>
</template>

<script lang="ts" setup>
import { useSerie } from '@/composables/serie';
import { ADD_ICON } from '@/constants/icons';
import { TOOLTIP_LOCATION, MAIN_COLOR } from '@/constants/style';
import { onBeforeMount, ref, type PropType } from 'vue';

const props = defineProps({
    serieId: { type: Number, required: true },
    tooltipLocation: { type: String as PropType<"left" | "bottom">, default: TOOLTIP_LOCATION }
});

const { addSerie, getSerieFromCache } = useSerie();

const exists = ref(false);

onBeforeMount(async () => {
    exists.value = !!(await getSerieFromCache(props.serieId));
});
</script>