<template>
  <div class="ms-2">
    <v-switch v-model="showMap" :color="MAIN_COLOR" label="Carte" density="compact" hide-details class="" />
  </div>
  <series-countries-map v-if="showMap" :data="data" />
  <base-pie-chart v-else :data="data.slice(0, MIN_LIMIT)" :title="TITLE" @click="emitClick" />
</template>

<script lang="ts" setup>
import BasePieChart from "@/components/BasePieChart.vue";
import SeriesCountriesMap from "@/components/stats/SeriesCountriesMap.vue";
import type { ChartData, Stat } from "@/models/stat";
import { ref } from "vue";
import { MAIN_COLOR } from "@/constants/style";
import { ChartGroupedType } from "@/types/types";

const TITLE = "Pays des séries";
const MIN_LIMIT = 10;

const props = defineProps({
  data: { type: Array<Stat>, default: [] },
});

const emit = defineEmits<{
  click: [ChartData]
}>();

const showMap = ref(false);

const emitClick = (data: { id: number, name: string, value: number }) => {
  emit("click", { kind: ChartGroupedType.Countries, ...data });
};
</script>