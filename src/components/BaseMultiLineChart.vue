<template>
  <v-card class="chart-card">
    <v-chart class="chart mt-2" :option="option" autoresize />
  </v-card>
</template>

<script lang="ts" setup>
import { use } from "echarts/core";
import { LineChart } from "echarts/charts";
import {
  GridComponent,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
} from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
import VChart from "vue-echarts";
import { computed, type PropType } from "vue";
import { useTheme } from "vuetify";
import { CATEGORICAL_COLORS } from "@/constants/style";

export interface MultiLineSeries {
  name: string;
  data: { label: string; value: number }[];
}

const props = defineProps({
  series: { type: Array as PropType<MultiLineSeries[]>, required: true },
  title: { type: String, required: true },
});

use([
  GridComponent,
  CanvasRenderer,
  LineChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
]);

const theme = useTheme();

const textColor = computed(() => theme.current.value.colors["on-surface"]);

// each series may cover a different set of labels (e.g. a service with no calls on some days
// has no row for that day at all) - the x-axis needs every label seen across all of them, in
// order, so every line lines up on the same axis instead of only plotting its own days
const labels = computed(() => {
  const seen = new Set<string>();
  props.series.forEach((s) => s.data.forEach((entry) => seen.add(entry.label)));
  return Array.from(seen).sort();
});

const option = computed(() => ({
  title: {
    text: props.title,
    left: "center",
    textStyle: { color: textColor.value },
  },
  tooltip: {
    trigger: "axis",
  },
  legend: {
    bottom: 0,
    textStyle: { color: textColor.value },
  },
  grid: {
    bottom: 48,
  },
  xAxis: {
    type: "category",
    data: labels.value,
  },
  yAxis: {
    type: "value",
  },
  series: props.series.map((s, index) => ({
    name: s.name,
    type: "line",
    smooth: true,
    itemStyle: { color: CATEGORICAL_COLORS[index % CATEGORICAL_COLORS.length] },
    data: labels.value.map((label) => s.data.find((entry) => entry.label === label)?.value ?? 0),
  })),
}));
</script>

<style scoped>
.chart-card {
  position: relative;
}
</style>
