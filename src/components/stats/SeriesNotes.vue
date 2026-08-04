<template>
    <base-pie-chart class="mb-2" :data="data" :item-style="itemStyle" :title="TITLE" @click="emitClick" />
</template>

<script lang="ts" setup>
import BasePieChart from "@/components/BasePieChart.vue";
import type { ChartData, Stat } from "@/models/stat";
import { computed } from "vue";
import { NOTE_COLORS_RGB } from "@/constants/style";
import { ChartGroupedType } from "@/types/types";

const TITLE = "Notes attribuées aux séries";

const props = defineProps({
  data: { type: Array<Stat>, default: [] },
});

const emit = defineEmits<{
    click: [ChartData]
}>();

const itemStyle = computed(() => props.data.map((record) => ({ color: NOTE_COLORS_RGB[record.id] })));

const emitClick = (data: { id: number, name: string, value: number }) => {
  emit("click", { kind: ChartGroupedType.Notes, ...data });
};
</script>