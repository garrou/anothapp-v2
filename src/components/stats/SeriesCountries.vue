<template>
  <v-switch v-model="showMap" :color="MAIN_COLOR" label="Afficher la carte" />
  <series-countries-map v-if="showMap" :data="data" />
  <base-pie-chart v-else class="mb-2" :data="data.slice(0, MIN_LIMIT)" :title="TITLE" @click="emitClick" />
</template>

<script lang="ts" setup>
import BasePieChart from "@/components/BasePieChart.vue";
import SeriesCountriesMap from "@/components/stats/SeriesCountriesMap.vue";
import type { ChartData, Stat } from "@/models/stat";
import { onBeforeMount, ref } from "vue";
import { useStatistic } from "@/composables/statistic";
import { MAIN_COLOR } from "@/constants/style";
import { ChartGroupedType } from "@/types/types";

const TITLE = "Pays des séries";
const MIN_LIMIT = 10;
const MAX_LIMIT = 200;

const props = defineProps({
  userId: { type: String, default: undefined },
});

const emit = defineEmits<{
  click: [ChartData]
}>();

const { getSeriesCountries } = useStatistic();

const showMap = ref(false);
const data = ref<Stat[]>([]);

const fetchCountries = async () => {
  data.value = await getSeriesCountries(MAX_LIMIT, props.userId);
}

const emitClick = (data: { id: number, name: string, value: number }) => {
  emit("click", { kind: ChartGroupedType.Countries, ...data });
};

onBeforeMount(fetchCountries);
</script>