<template>
  <v-card>
    <v-chart class="chart" :option="chartOptions" autoresize />
  </v-card>
</template>

<script setup lang="ts">
import { computed, onMounted, type PropType } from "vue";
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { MapChart } from "echarts/charts";
import { TitleComponent, TooltipComponent, VisualMapComponent } from "echarts/components";
import VChart from "vue-echarts";
import { useTheme } from "vuetify";
import worldGeoJSON from "@/assets/world.json";
import * as echarts from "echarts";
import type { GeoJSONSourceInput } from "echarts/types/src/coord/geo/geoTypes.js";
import type { Stat } from "@/models/stat";
import { SEQUENTIAL_COLORS } from "@/constants/style";

use([CanvasRenderer, MapChart, TitleComponent, TooltipComponent, VisualMapComponent]);

const props = defineProps({
  data: { type: Object as PropType<Stat[]>, default: () => [] },
});

const theme = useTheme();

// ECharts renders titles/labels on a canvas, unaffected by the app's CSS
// theme variables — the color has to be resolved and passed explicitly,
// otherwise it defaults to a dark grey that's unreadable on dark surfaces.
const textColor = computed(() => theme.current.value.colors["on-surface"]);

const chartOptions = computed(() => ({
  title: {
    text: "Pays des séries",
    left: "center",
    textStyle: { color: textColor.value },
  },
  tooltip: { trigger: "item" },
  visualMap: {
    roam: true,
    min: 0,
    max: Math.max(...props.data.map((record) => record.value)),
    left: "left",
    top: "bottom",
    calculable: true,
    inRange: { color: SEQUENTIAL_COLORS },
    textStyle: { color: textColor.value },
  },
  series: [
    {
      roam: true,
      zoom: 1.5,
      name: "Pays",
      scaleLimit: { min: 0.5, max: 5 },
      type: "map",
      map: "world",
      emphasis: { label: { show: true }, itemStyle: { areaColor: SEQUENTIAL_COLORS[4] } },
      itemStyle: { borderColor: "#fff", borderWidth: 0.5 },
      data: props.data.map((record) => ({ name: record.label, value: record.value }))
    },
  ],
}));

onMounted(() => {
  echarts.registerMap("world", worldGeoJSON as GeoJSONSourceInput);
});
</script>

<style scoped>
.chart {
  width: 100%;
  height: 500px;
}
</style>
