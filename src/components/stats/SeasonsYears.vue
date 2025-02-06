<template>
  <base-bar-chart class="mb-2" :color="color" :data="data" :id="CHART_ID" :title="TITLE" />
</template>

<script lang="ts" setup>
import BaseBarChart from "@/components/BaseBarChart.vue";
import type { Stat } from "@/models/stat";
import { onBeforeMount, ref } from "vue";
import { useStatistic } from "@/composables/statistic";
import storageService from "@/services/storageService";

const CHART_ID = "seasons-years";
const DEFAULT_COLOR = "#1a20e8";
const TITLE = "Saisons par années";

const props = defineProps({
  userId: { type: String, default: undefined },
});

const { getSeasonsYears } = useStatistic();

const color = ref(DEFAULT_COLOR);
const data = ref<Stat[]>([]);

onBeforeMount(async () => {
  color.value = storageService.getColorChart(CHART_ID) ?? DEFAULT_COLOR;
  data.value = await getSeasonsYears(props.userId);
});
</script>