<template>
    <template v-if="isDisplayable" class="mb-2">
        <base-bar-chart v-if="type === ChartType.Bar" :color-index="colorIndex" :data="computedData" :title="title" />
        <base-pie-chart v-if="type === ChartType.Pie" :data="computedData" :title="title" />
        <base-line-chart v-if="type === ChartType.Line" :color-index="colorIndex" :data="computedData" :title="title" />
    </template>
</template>

<script lang="ts" setup>
import BaseBarChart from "@/components/BaseBarChart.vue";
import BaseLineChart from "../BaseLineChart.vue";
import BasePieChart from "../BasePieChart.vue";
import type { ChartData, Stat } from "@/models/stat";
import { computed, type PropType } from "vue";
import { ChartType } from "@/types/types";
import { minsToHours } from "@/utils/format.js";

const props = defineProps({
    data: { type: Array as PropType<Stat[]>, default: [] },
    type: { type: String as PropType<ChartType>, required: true },
    title: { type: String, required: true },
    chartId: { type: String, required: true },
    colorIndex: { type: Number, default: 0 }
});

const emit = defineEmits<{
    click: [ChartData]
}>();

const isDisplayable = computed(() => props.data.length > 0);
const computedData = computed(() => props.chartId === "best-months" ? props.data.map((obj) => ({
    id: obj.id,
    label: obj.label,
    value: minsToHours(obj.value)
})) : props.data);
</script>