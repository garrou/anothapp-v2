<template>
  <base-bar-chart class="mb-2" :color="color" :data="data" :id="CHART_ID" title="Episodes par mois cette année" />
</template>

<script lang="ts" setup>
import BaseBarChart from "@/components/BaseBarChart.vue";
import type { Stat } from "@/models/stat";
import { onBeforeMount, ref } from "vue";
import { useStatistic } from "@/composables/statistic";
import storageService from "@/services/storageService";

const CHART_ID = "episodes-months-curr-year";
const DEFAULT_COLOR = "#1ae86c";

const props = defineProps({
  userId: { type: String, default: undefined },
});

const { getEpisodesMonthCurrYear } = useStatistic();

const color = ref(DEFAULT_COLOR);
const data = ref<Stat[]>([]);

onBeforeMount(async () => {
  color.value = storageService.getColorChart(CHART_ID) ?? DEFAULT_COLOR;
  data.value = await getEpisodesMonthCurrYear(props.userId);
});
</script>