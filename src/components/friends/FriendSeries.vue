<template>
    <v-expansion-panels v-if="userId" :elevation="ELEVATION" class="mb-2">
        <v-expansion-panel>
            <template #title>
                <span class="v-card-title pa-0">{{ sharedSeriesLabel }}</span>
            </template>
            <template #text>
                <v-table>
                    <tbody>
                        <tr v-for="serie in series" :key="serie.id">
                            <td>
                                <router-link :text="serie.title"
                                    :to="type === 'shared' ? `/series/${serie.id}` : `/discover/${serie.id}`" />
                            </td>
                        </tr>
                    </tbody>
                </v-table>
            </template>
        </v-expansion-panel>
    </v-expansion-panels>
</template>

<script lang="ts" setup>
import { useSerie } from '@/composables/serie';
import { ELEVATION } from '@/constants/style';
import type { Serie } from '@/models/serie';
import { SerieStatus } from '@/types/types';
import { buildPlural } from '@/utils/format';
import { computed, onBeforeMount, ref, type PropType } from 'vue';

const props = defineProps({
    userId: { type: String, required: true },
    type: { type: String as PropType<SerieStatus.Shared | SerieStatus.Favorite>, required: true }
});

const { getSeriesByStatus } = useSerie();

const sharedSeriesLabel = computed(() => props.type === SerieStatus.Shared
    ? `${buildPlural("série", series.value.length)} ${buildPlural("commune", series.value.length, false, false)}`
    : `${buildPlural("série", series.value.length)} ${buildPlural("favorite", series.value.length, false, false)}`);

const series = ref<Serie[]>([]);

onBeforeMount(async () => {
    series.value = props.type === SerieStatus.Shared
        ? await getSeriesByStatus(SerieStatus.Shared, props.userId)
        : await getSeriesByStatus(SerieStatus.Favorite, props.userId);
});
</script>
