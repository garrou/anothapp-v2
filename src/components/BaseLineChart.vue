<template>
  <v-card>
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
} from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
import VChart from "vue-echarts";
import { computed, type PropType } from "vue";
import type { Stat } from "@/models/stat";

const props = defineProps({
  color: { type: String, required: true },
  data: { type: Array as PropType<Stat[]>, required: true },
  title: { type: String, required: true },
})

use([
  GridComponent,
  CanvasRenderer,
  LineChart,
  TitleComponent,
  TooltipComponent,
]);

const option = computed(() => ({
  title: {
    text: props.title,
    left: "center",
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
        color: props.color
      },
      type: "line",
      smooth: true
    }
  ]
}));
</script>