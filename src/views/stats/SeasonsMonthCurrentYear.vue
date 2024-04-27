<template>
  <base-bar-chart class="mb-2" :color="color" :data="data" :id="CHART_ID" title="Saisons par mois cette année" />
</template>

<script lang="ts" setup>
import BaseBarChart from "@/components/BaseBarChart.vue";
import type { Stat } from "@/models/stat";
import { onBeforeMount, ref } from "vue";
import { useStatistic } from "@/composables/statistic";
import storageService from "@/services/storageService";

const CHART_ID = "seasons-months-curr-year";
const DEFAULT_COLOR = "#a84632";

const props = defineProps({
  userId: { type: String, default: undefined },
});

const { getSeasonsMonthCurrYear } = useStatistic();

const color = ref(DEFAULT_COLOR);
const data = ref<Stat[]>([]);

onBeforeMount(async () => {
  color.value = storageService.getColorChart(CHART_ID, DEFAULT_COLOR);
  data.value = await getSeasonsMonthCurrYear(props.userId);
});
</script>