<template>
  <base-pie-chart class="mb-2" :data="data" :title="TITLE" />
</template>

<script lang="ts" setup>
import BasePieChart from "@/components/BasePieChart.vue";
import type { Stat } from "@/models/stat";
import { onBeforeMount, ref } from "vue";
import { useStatistic } from "@/composables/statistic";

const TITLE = "Genres les plus regardés";

const props = defineProps({
  userId: { type: String, default: undefined },
});

const { getSeriesKinds } = useStatistic();

const data = ref<Stat[]>([]);

onBeforeMount(async () => {
  data.value = await getSeriesKinds(props.userId);
});
</script>