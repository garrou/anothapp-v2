<template>
  <base-pie-chart class="mb-2" :data="data" :title="TITLE" @click="emitClick" />
</template>

<script lang="ts" setup>
import BasePieChart from "@/components/BasePieChart.vue";
import type { ChartData, Stat } from "@/models/stat";
import { ChartGroupedType } from "@/types/types";

const TITLE = "Genres les plus regardés";

const props = defineProps({
  data: { type: Array<Stat>, default: [] },
});

const emit = defineEmits<{
  click: [ChartData]
}>();

const emitClick = (data: { id: number, name: string, value: number }) => {
  emit("click", { kind: ChartGroupedType.Kinds, ...data });
};
</script>