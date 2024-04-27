<template>
  <base-bar-chart class="mb-2" :color="DEFAULT_COLOR" :data="data" :id="CHART_ID" title="Episodes par années" />
</template>

<script lang="ts" setup>
import BaseBarChart from "@/components/BaseBarChart.vue";
import type { Stat } from "@/models/stat";
import { onBeforeMount, ref } from "vue";
import { useStatistic } from "@/composables/statistic";
import storageService from "@/services/storageService";

const CHART_ID = "episodes-years";
const DEFAULT_COLOR = "#e81a70";

const props = defineProps({
  userId: { type: String, default: undefined },
});

const { getEpisodesYears } = useStatistic();

const color = ref(DEFAULT_COLOR);
const data = ref<Stat[]>([]);

onBeforeMount(async () => {
  color.value = storageService.getColorChart(CHART_ID, DEFAULT_COLOR);
  data.value = await getEpisodesYears(props.userId);
});
</script>