<template>
  <base-line-chart class="mb-2" :color="color" :data="data" :id="CHART_ID" title="Temps en heures par années" />
</template>

<script lang="ts" setup>
import BaseLineChart from "@/components/BaseLineChart.vue";
import type { Stat } from "@/models/stat";
import { onBeforeMount, ref } from "vue";
import { useStatistic } from "@/composables/statistic";
import storageService from "@/services/storageService";

const CHART_ID = "time-hours-years";
const DEFAULT_COLOR = "#2bccf0";

const props = defineProps({
  userId: { type: String, default: undefined },
});

const { getTimeByYears } = useStatistic();

const color = ref(DEFAULT_COLOR);
const data = ref<Stat[]>([]);

onBeforeMount(async () => {
  color.value = storageService.getColorChart(CHART_ID) ?? DEFAULT_COLOR;
  data.value = await getTimeByYears(props.userId);
});
</script>