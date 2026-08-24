<template>
    <v-card>
        <v-chart class="chart" :option="chartOptions" autoresize />
    </v-card>
</template>

<script setup lang="ts">
import { computed, type PropType } from "vue";
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { HeatmapChart } from "echarts/charts";
import { CalendarComponent, TitleComponent, TooltipComponent, VisualMapComponent } from "echarts/components";
import VChart from "vue-echarts";
import { useTheme } from "vuetify";
import { SEQUENTIAL_COLORS } from "@/constants/style";

use([CanvasRenderer, HeatmapChart, CalendarComponent, TitleComponent, TooltipComponent, VisualMapComponent]);

const props = defineProps({
    data: { type: Array as PropType<{ date: string; value: number }[]>, default: () => [] }
});

const theme = useTheme();

const textColor = computed(() => theme.current.value.colors["on-surface"]);
const lineColor = computed(() => theme.current.value.colors["surface-variant"]);

const range = computed<[string, string]>(() => {
    const today = new Date();
    const start = new Date(today);
    start.setFullYear(start.getFullYear() - 1);
    start.setDate(start.getDate() + 1);
    const toISO = (date: Date) => date.toISOString().slice(0, 10);
    return [toISO(start), toISO(today)];
});

const maxValue = computed(() => Math.max(1, ...props.data.map((d) => d.value)));

const chartOptions = computed(() => ({
    title: {
        text: "Épisodes visionnés",
        left: "center",
        textStyle: { color: textColor.value }
    },
    tooltip: {
        position: "top",
        formatter: (params: { data: [string, number] }) => {
            const [date, value] = params.data;
            return `${date} : ${value} épisode${value > 1 ? "s" : ""}`;
        }
    },
    visualMap: {
        min: 0,
        max: maxValue.value,
        calculable: true,
        orient: "horizontal",
        left: "center",
        top: 36,
        inRange: { color: SEQUENTIAL_COLORS },
        textStyle: { color: textColor.value }
    },
    calendar: {
        top: 90,
        left: 30,
        right: 20,
        range: range.value,
        cellSize: ["auto", 14],
        itemStyle: { borderWidth: 2, borderColor: lineColor.value },
        yearLabel: { show: false },
        dayLabel: { color: textColor.value },
        monthLabel: { color: textColor.value },
        splitLine: { lineStyle: { color: lineColor.value } }
    },
    series: {
        type: "heatmap",
        coordinateSystem: "calendar",
        data: props.data.map((d) => [d.date, d.value])
    }
}));
</script>

<style scoped>
.chart {
    width: 100%;
    height: 220px;
}
</style>
