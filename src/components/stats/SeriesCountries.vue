<template>
  <v-switch v-model="showMap" color="black" label="Afficher la carte" />
  <series-countries-map v-if="showMap" :data="data" />
  <base-pie-chart v-else class="mb-2" :data="data.slice(0, MIN_LIMIT)" :title="TITLE" />
</template>

<script lang="ts" setup>
import BasePieChart from "@/components/BasePieChart.vue";
import SeriesCountriesMap from "@/components/stats/SeriesCountriesMap.vue";
import type { Stat } from "@/models/stat";
import { onBeforeMount, ref, watch } from "vue";
import { useStatistic } from "@/composables/statistic";

const TITLE = "Pays des séries";
const MIN_LIMIT = 10;
const MAX_LIMIT = 200;

const props = defineProps({
  userId: { type: String, default: undefined },
});

const { getSeriesCountries } = useStatistic();

const showMap = ref(false);
const data = ref<Stat[]>([]);

const fetchCountries = async () => {
  data.value = await getSeriesCountries(MAX_LIMIT, props.userId);
}

onBeforeMount(fetchCountries);
</script>