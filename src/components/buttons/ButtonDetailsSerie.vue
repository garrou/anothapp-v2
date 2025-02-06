<template>
    <v-tooltip v-if="exists" text="Page des détails" :location="tooltipLocation">
        <template v-slot:activator="{ props }">
            <v-btn v-bind="props" color="surface-variant" elevation="0" icon="mdi-information" variant="text"
                @click="$router.push(`/discover/${serieId}`)" />
        </template>
    </v-tooltip>
</template>

<script lang="ts" setup>
import { useSerie } from '@/composables/serie';
import { TOOLTIP_LOCATION } from '@/constants/style';
import { onBeforeMount, ref, type PropType } from 'vue';

const props = defineProps({
    serieId: { type: Number, required: true },
    tooltipLocation: { type: String as PropType<"left" | "bottom">, default: TOOLTIP_LOCATION }
});

const { getSerieFromCache } = useSerie();

const exists = ref(false);

onBeforeMount(async () => {
    exists.value = !!(await getSerieFromCache(props.serieId));
});
</script>