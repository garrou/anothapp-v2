<template>
  <v-card class="chart-card">
    <v-chart class="chart mt-2" :option="option" autoresize />
  </v-card>
</template>

<script lang="ts" setup>
import { use } from "echarts/core";
import { BarChart } from "echarts/charts";
import {
  GridComponent,
  TitleComponent,
  TooltipComponent,
} from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
import VChart from "vue-echarts";
import { computed, type PropType } from "vue";
import { useTheme } from "vuetify";
import type { Stat } from "@/models/stat";
import { getCategoricalColor } from "@/constants/style";

const props = defineProps({
  colorIndex: { type: Number, required: true },
  data: { type: Array as PropType<Stat[]>, required: true },
  title: { type: String, required: true },
});

use([
  GridComponent,
  CanvasRenderer,
  BarChart,
  TitleComponent,
  TooltipComponent,
]);

const theme = useTheme();
const color = computed(() => getCategoricalColor(props.colorIndex, theme.current.value.dark));

const textColor = computed(() => theme.current.value.colors["on-surface"]);

const option = computed(() => ({
  title: {
    text: props.title,
    left: "center",
    textStyle: { color: textColor.value },
  },
  tooltip: {
    trigger: "item",
    formatter: "{b} : {c}",
  },
  xAxis: {
    type: "category",
    data: props.data.map((record) => record.label)
  },
  yAxis: {
    type: "value"
  },
  series: [
    {
      data: props.data.map((record) => record.value),
      itemStyle: {
        color: color.value
      },
      type: "bar"
    }
  ]
}));
</script>

<style scoped>
.chart-card {
  position: relative;
}
</style>