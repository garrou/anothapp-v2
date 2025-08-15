<template>
    <base-pie-chart class="mb-2" :data="data" :item-style="itemStyle" :title="TITLE" @click="emitClick" />
</template>

<script lang="ts" setup>
import BasePieChart from "@/components/BasePieChart.vue";
import type { ChartData, Stat } from "@/models/stat";
import { computed, onBeforeMount, ref } from "vue";
import { useStatistic } from "@/composables/statistic";
import { NOTE_COLORS_RGB } from "@/constants/style";
import { ChartGroupedType } from "@/types/types";

const TITLE = "Notes attribuées aux séries";

const props = defineProps({
    userId: { type: String, default: undefined },
});

const emit = defineEmits<{
    click: [ChartData]
}>();

const { getSeriesNotes } = useStatistic();

const data = ref<Stat[]>([]);

const itemStyle = computed(() => data.value.map((record) => ({ color: NOTE_COLORS_RGB[record.id] })));

const emitClick = (data: { id: number, name: string, value: number }) => {
  emit("click", { kind: ChartGroupedType.Notes, ...data });
};

onBeforeMount(async () => {
    data.value = await getSeriesNotes(props.userId);
});
</script>