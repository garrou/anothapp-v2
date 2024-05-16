<template>
  <v-card>
    <base-color :default="colorRef" :id="id" @change="changeColor" />
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
import { computed, ref, type PropType } from "vue";
import type { Stat } from "@/models/stat";
import BaseColor from "./BaseColor.vue";
import storageService from "@/services/storageService";

const props = defineProps({
  color: { type: String, required: true },
  data: { type: Array as PropType<Stat[]>, required: true },
  id: { type: String, required: true },
  title: { type: String, required: true },
});

use([
  GridComponent,
  CanvasRenderer,
  BarChart,
  TitleComponent,
  TooltipComponent,
]);

const colorRef = ref(props.color);

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
        color: colorRef.value
      },
      type: "bar"
    }
  ]
}));

const changeColor = () => {
  colorRef.value = storageService.getColorChart(props.id) ?? props.color;
}
</script>