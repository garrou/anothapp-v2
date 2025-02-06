<template>
  <div>
    <v-chart class="chart" :option="chartOptions" autoresize />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, type PropType } from "vue";
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { MapChart } from "echarts/charts";
import { VisualMapComponent } from "echarts/components";
import VChart from "vue-echarts";
import worldGeoJSON from "@/assets/world.json";
import * as echarts from "echarts";
import type { GeoJSONSourceInput } from "echarts/types/src/coord/geo/geoTypes.js";
import type { Stat } from "@/models/stat";

use([CanvasRenderer, MapChart, VisualMapComponent]);

const props = defineProps({
  data: { type: Object as PropType<Stat[]>, default: () => [] },
});


const chartOptions = ref({
  tooltip: { trigger: "item" },
  visualMap: {
    roam: true,
    min: 0,
    max: Math.max(...props.data.map((record) => record.value)),
    left: "left",
    top: "bottom",
    calculable: true,
  },
  series: [
    {
      roam: true,
      zoom: 1.5,
      name: "Pays",
      scaleLimit: { min: 0.5, max: 5 },
      type: "map",
      map: "world",
      emphasis: { label: { show: true } },
      data: props.data.map((record) => ({ name: record.label, value: record.value }))
    },
  ],
});

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
