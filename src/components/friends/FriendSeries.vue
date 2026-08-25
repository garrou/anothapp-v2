<template>
    <v-expansion-panels v-if="userId" :elevation="ELEVATION" class="mb-2">
        <v-expansion-panel>
            <template #title>
                <span class="v-card-title pa-0">{{ sharedSeriesLabel }}</span>
            </template>
            <template #text>
                <series-link-list :series="series" :base-path="type === 'shared' ? '/series' : '/discover'" />
            </template>
        </v-expansion-panel>
    </v-expansion-panels>
</template>

<script lang="ts" setup>
import { useSerie } from '@/composables/serie';
import { ELEVATION } from '@/constants/style';
import type { Serie } from '@/models/serie';
import SeriesLinkList from '@/components/series/SeriesLinkList.vue';
import { SerieStatus } from '@/types/types';
import { buildPlural } from '@/utils/format';
import { computed, onBeforeMount, ref, type PropType } from 'vue';

const props = defineProps({
    userId: { type: String, required: true },
    type: { type: String as PropType<SerieStatus.All | SerieStatus.Shared | SerieStatus.Favorite>, required: true }
});

const { getSeriesByStatus } = useSerie();

const LABELS: Record<string, string> = {
    [SerieStatus.All]: "vue",
    [SerieStatus.Shared]: "commune",
    [SerieStatus.Favorite]: "favorite",
};

const sharedSeriesLabel = computed(() =>
    `${buildPlural("série", series.value.length)} ${buildPlural(LABELS[props.type], series.value.length, false, false)}`);

const series = ref<Serie[]>([]);

onBeforeMount(async () => {
    series.value = await getSeriesByStatus(props.type, props.userId);
});
</script>
