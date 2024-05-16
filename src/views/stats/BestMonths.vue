<template>
    <base-bar-chart class="mb-2" :color="color" :data="data" :id="CHART_ID" :title="TITLE" />
</template>

<script lang="ts" setup>
import BaseBarChart from "@/components/BaseBarChart.vue";
import type { Stat } from "@/models/stat";
import { onBeforeMount, ref } from "vue";
import { useStatistic } from "@/composables/statistic";
import storageService from "@/services/storageService";
import { minsToHours } from "@/utils/format";

const CHART_ID = "best-months";
const DEFAULT_COLOR = "#03fccf";
const TITLE = "Mois records en heures";

const props = defineProps({
    userId: { type: String, default: undefined },
});

const { getBestMonths } = useStatistic();

const color = ref(DEFAULT_COLOR);
const data = ref<Stat[]>([]);

onBeforeMount(async () => {
    color.value = storageService.getColorChart(CHART_ID) ?? DEFAULT_COLOR;
    data.value = (await getBestMonths(props.userId)).map((obj) => ({
        label: obj.label,
        value: minsToHours(obj.value) 
    })).reverse();
});
</script>