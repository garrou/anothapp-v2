<template>
  <v-card>
    <v-chart class="chart mt-2" color="#f0a12b" :option="option" autoresize />
  </v-card>
</template>

<script lang="ts" setup>
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { PieChart } from 'echarts/charts';
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
} from 'echarts/components';
import VChart from 'vue-echarts';
import { computed, type PropType } from 'vue';
import type { Stat } from '@/models/stat';

const props = defineProps({
  data: { type: Array as PropType<Stat[]>, required: true },
  title: { type: String, required: true },
})

use([
  GridComponent,
  CanvasRenderer,
  PieChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
]);

const option = computed(() => ({
  title: {
    text: props.title,
    left: 'center',
  },
  tooltip: {
    trigger: 'item',
    formatter: '{b} : {c} ({d}%)',
  },
  series: [
    {
      name: props.title,
      type: 'pie',
      radius: '60%',
      data: props.data.map((record) => ({
        name: record.label,
        value: record.value
      })),
    },
  ],
}));
</script>