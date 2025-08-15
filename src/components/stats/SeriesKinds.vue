<template>
  <base-pie-chart class="mb-2" :data="data" :title="TITLE" @click="emitClick" />
</template>

<script lang="ts" setup>
import BasePieChart from "@/components/BasePieChart.vue";
import type { ChartData, Stat } from "@/models/stat";
import { onBeforeMount, ref } from "vue";
import { useStatistic } from "@/composables/statistic";
import { ChartGroupedType } from "@/types/types";

const TITLE = "Genres les plus regardés";

const props = defineProps({
  userId: { type: String, default: undefined },
});

const emit = defineEmits<{
  click: [ChartData]
}>();

const { getSeriesKinds } = useStatistic();

const data = ref<Stat[]>([]);

const emitClick = (data: { id: number, name: string, value: number }) => {
  emit("click", { kind: ChartGroupedType.Kinds, ...data });
};

onBeforeMount(async () => {
  data.value = await getSeriesKinds(props.userId);
});
</script>